import { AbiCoder, concat, ethers, JsonRpcProvider, MaxUint256, toBeHex, Wallet } from "ethers";

import { Multicall3__factory } from "../../types";
import { ContractCall, MULTICALL_ADDRESS, useMulticall } from "../../helpers/multicall";
import { delay } from "../../helpers";
import { FEE_PRECISION, IPositionToLiquidate, PRECISION, StateSync } from "./StateSync";
import {
  ARBITRAGE_PROXY,
  CurveStableSwapNGInterface,
  DefaultSwapRoute,
  ERC20Interface,
  FxProtocolBatchExecutorInterface,
  FXUSD_BASE_POOL,
  FxUSDBasePoolInterface,
  MULTI_PATH_CONVERTER,
  MultiPathConverterInterface,
  PoolBaseToken,
  PriceOracleInterface,
  RateProviderInterface,
  USDC_fxUSD_CURVE_POOL,
} from "./constants";
import { EthereumTokens } from "../../common";
import { sendTx } from "./helper";
import { getDy } from "./stable";

const USDC_SCALAR = 10n ** 12n;
const RATES = [USDC_SCALAR, 1n];
const SLIPPAGE = 1n;

interface StableSwap {
  Amp: bigint;
  BaseFee: bigint;
  OffpegFeeMultiplier: bigint;
  usdcInCurve: bigint;
  fxusdInCurve: bigint;
}

function getRawDebtToLiquidate(position: IPositionToLiquidate, balance: bigint): bigint {
  // rawDebts / price * (1 + bonus) <= position.rawColls + balance
  // rawDebts <= (position.rawColls + balance) / (1 + bonus) * price
  let rawDebts =
    ((((position.rawColls + balance) * position.price) / PRECISION) * FEE_PRECISION) /
    (FEE_PRECISION + position.bonusRatio);
  (position.rawColls * position.price) / PRECISION;
  if (rawDebts > position.rawDebts) rawDebts = position.rawDebts;
  return rawDebts;
}

async function handleLiquidate(
  dryRun: boolean,
  usePrivateTx: boolean,
  wallet: Wallet,
  state: StateSync,
  poolAddr: string,
  positions: Array<IPositionToLiquidate>,
  rates: Record<string, [bigint, bigint]>,
  balances: Record<string, bigint>,
  maxLiquidity: bigint,
  swap: StableSwap,
) {
  // sort by debts in decreasing order
  positions.sort((a, b) => {
    const ra = getRawDebtToLiquidate(a, balances[a.token]);
    const rb = getRawDebtToLiquidate(b, balances[b.token]);
    if (ra < rb) return 1;
    else if (ra > rb) return -1;
    else return 0;
  });
  console.log("number of liquidatable positions:", positions.length);
  if (positions.length === 0) return;
  // pick at most 8 positions
  let positionEncoding = 0n;
  let totalDebts = 0n;
  let totalBonus = 0n;
  const locks: Array<[string, number]> = [];
  for (let i = 0; i < positions.length && i < 8; ++i) {
    const position = positions[i];
    positionEncoding = (positionEncoding << 32n) + BigInt(position.position);

    let debts = getRawDebtToLiquidate(position, balances[position.token]);
    if (debts > maxLiquidity) debts = maxLiquidity;
    const bonus =
      (((debts * position.bonusRatio) / FEE_PRECISION) * (FEE_PRECISION - state.manager.liquidationExpenseRatio)) /
      FEE_PRECISION;
    console.log(
      "Liquidate:",
      `Pool[${position.pool}]`,
      `Position[${position.position}]`,
      `Debts[${ethers.formatEther(debts)}]`,
      `Repay[${ethers.formatEther(debts)} fxUSD]`,
      `Bonus[${ethers.formatEther(bonus)}]`,
    );
    totalDebts += debts;
    totalBonus += bonus;
    locks.push([position.pool, position.position]);
    // liquidate no more than 1 million fxUSD
    if (totalDebts > ethers.parseEther("1000000")) break;
  }
  // debt too small, ignore
  if (totalDebts <= ethers.parseEther("0.01")) return;
  let executorData = "0x";
  if (totalDebts >= ethers.parseEther("1000")) {
    // use flashloan
    const swapped = getDy(
      [swap.usdcInCurve, swap.fxusdInCurve],
      RATES,
      swap.Amp,
      swap.BaseFee,
      swap.OffpegFeeMultiplier,
      0,
      1,
      totalDebts / USDC_SCALAR,
    );
    const useUSDC = swapped < totalDebts;
    // swap collateral token to USDC, changed to dex aggregator later
    const swapRoute = DefaultSwapRoute[poolAddr];
    const swapData = MultiPathConverterInterface.encodeFunctionData("convert", [
      PoolBaseToken[poolAddr],
      MaxUint256,
      swapRoute.encoding,
      swapRoute.routes,
    ]);
    const executorEncoding = (useUSDC ? 1 : 0) + 2; // liquidate
    const userData = AbiCoder.defaultAbiCoder().encode(
      ["address", "uint256", "address", "bytes"],
      [poolAddr, positionEncoding, MULTI_PATH_CONVERTER, swapData],
    );
    executorData = FxProtocolBatchExecutorInterface.encodeFunctionData("rebalanceOrLiquidate", [
      ((totalDebts / USDC_SCALAR) * (10000n + SLIPPAGE)) / 10000n,
      concat([toBeHex(executorEncoding), userData]),
    ]);
  } else {
    // liquidate without flashloan
    executorData = FxProtocolBatchExecutorInterface.encodeFunctionData("liquidate", [
      poolAddr,
      EthereumTokens.fxUSD.address,
      positionEncoding,
    ]);
  }
  if (!dryRun) {
    await sendTx(wallet, ARBITRAGE_PROXY, executorData, usePrivateTx);
    for (const [pool, position] of locks) {
      state.lockPosition(pool, position, 60);
    }
  } else {
    console.log(`target[${ARBITRAGE_PROXY}]`, `calldata[${executorData}]`);
  }
}

export async function run(options: {
  dry: boolean;
  store: string;
  rpcUrl: string;
  private: string;
  usePrivateTx: boolean;
}) {
  const state = new StateSync(options.store);
  const provider = new JsonRpcProvider(options.rpcUrl);
  const wallet = new Wallet(options.private, provider);
  const multicall = Multicall3__factory.connect(MULTICALL_ADDRESS, provider);

  while (true) {
    try {
      await state.sync(provider);
    } catch (e) {
      console.log("sync error:", e);
      await delay(2000);
      continue;
    }
    try {
      const latest = await provider.getBlockNumber();
      if (latest === state.lastSyncAt + 1) {
        // fetch prices and rates
        const calls: ContractCall[] = [];
        Object.entries(state.pools).forEach(([_poolAddr, pool]) => {
          calls.push({
            interface: PriceOracleInterface,
            address: pool.oracle,
            method: "getPrice",
            parameters: [],
          });
        });
        Object.entries(state.manager.rateProvider).forEach(([tokenAddr, [_scalar, rateAddr]]) => {
          calls.push({
            interface: RateProviderInterface,
            address: rateAddr,
            method: "getRate",
            parameters: [],
          });
          calls.push({
            interface: ERC20Interface,
            address: tokenAddr,
            method: "balanceOf",
            parameters: [state.manager.reservePoolAddr],
          });
        });
        calls.push({
          interface: FxUSDBasePoolInterface,
          address: FXUSD_BASE_POOL,
          method: "totalYieldToken",
          parameters: [],
        });
        calls.push({
          interface: FxUSDBasePoolInterface,
          address: FXUSD_BASE_POOL,
          method: "totalStableToken",
          parameters: [],
        });
        calls.push({
          interface: FxUSDBasePoolInterface,
          address: FXUSD_BASE_POOL,
          method: "getStableTokenPriceWithScale",
          parameters: [],
        });
        calls.push({
          interface: CurveStableSwapNGInterface,
          address: USDC_fxUSD_CURVE_POOL,
          method: "A_precise",
          parameters: [],
        });
        calls.push({
          interface: CurveStableSwapNGInterface,
          address: USDC_fxUSD_CURVE_POOL,
          method: "fee",
          parameters: [],
        });
        calls.push({
          interface: CurveStableSwapNGInterface,
          address: USDC_fxUSD_CURVE_POOL,
          method: "offpeg_fee_multiplier",
          parameters: [],
        });
        calls.push({
          interface: CurveStableSwapNGInterface,
          address: USDC_fxUSD_CURVE_POOL,
          method: "balances",
          parameters: [0],
        });
        calls.push({
          interface: CurveStableSwapNGInterface,
          address: USDC_fxUSD_CURVE_POOL,
          method: "balances",
          parameters: [1],
        });
        const [, results] = await useMulticall(multicall, calls);
        const prices: Record<string, bigint> = {};
        const rates: Record<string, [bigint, bigint]> = {};
        const balances: Record<string, bigint> = {};
        const swap: StableSwap = {
          Amp: 0n,
          BaseFee: 0n,
          OffpegFeeMultiplier: 0n,
          usdcInCurve: 0n,
          fxusdInCurve: 0n,
        };
        Object.entries(state.pools).forEach(([poolAddr, _pool]) => {
          const result = results.shift()!;
          prices[poolAddr] = result[1];
        });
        Object.entries(state.manager.rateProvider).forEach(([tokenAddr, [scalar, _rateAddr]]) => {
          const rateResult = results.shift()!;
          rates[tokenAddr] = [scalar, rateResult[0]];
          const balanceResult = results.shift()!;
          balances[tokenAddr] = balanceResult[0];
        });
        const fxusdInBase: bigint = results.shift()![0];
        const usdcInBase: bigint = results.shift()![0];
        const usdcPrice: bigint = results.shift()![0];
        swap.Amp = results.shift()![0];
        swap.BaseFee = results.shift()![0];
        swap.OffpegFeeMultiplier = results.shift()![0];
        swap.usdcInCurve = results.shift()![0];
        swap.fxusdInCurve = results.shift()![0];
        const maxLiquidity = fxusdInBase + (usdcInBase * usdcPrice) / PRECISION;

        const allPositions = state.getPositionsToLiquidate(prices);
        for (const [pool, positions] of Object.entries(allPositions)) {
          await handleLiquidate(
            options.dry,
            options.usePrivateTx,
            wallet,
            state,
            pool,
            positions,
            rates,
            balances,
            maxLiquidity,
            swap,
          );
        }
      }
      await delay(2000);
    } catch (e) {
      console.log("Rebalance error:", e);
      await delay(10000);
    }
  }
}
