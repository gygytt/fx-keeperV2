import { ethers, JsonRpcProvider } from "ethers";

import { SpotPricePool } from "../common";
import { Multicall3__factory, SpotPriceOracle__factory } from "../types";
import { ContractCall, MULTICALL_ADDRESS, useMulticall } from "./multicall";

const SpotPriceOracleInterface = SpotPriceOracle__factory.createInterface();

export async function fetchOnChainPrices(
  provider: JsonRpcProvider,
  tokens: Array<string>,
): Promise<Record<string, number>> {
  const ETHUSD = "WETH/USDC-Uni500";
  const prices: {
    [symbol: string]: Array<string>;
  } = {
    AIOZ: ["AIOZ/WETH-Crv2C90", ETHUSD],
    ALCX: ["ALCX/WETH-Sushi", ETHUSD],
    CNC: ["CNC/WETH-Crv2C45", ETHUSD],
    CJPY: ["CJPY/WETH-Crv2C5", ETHUSD],
    CRV: ["CRV/WETH-Crv3C4", ETHUSD],
    CVG: ["CVG/WETH-Crv2C0", ETHUSD],
    CVX: ["CVX/WETH-Crv2C", ETHUSD],
    DINERO: ["DINERO/WETH-Uni3000", ETHUSD],
    FXN: ["FXN/WETH-Crv2C311", ETHUSD],
    FXS: ["FXS/FRAX-Uni10000", "FRAX/USDC-CrvSB"],
    GHO: ["GHO/USDC-BalV2S1497"],
    GMAC: ["GMAC/WETH-Uni", ETHUSD],
    INV: ["INV/USDC-Crv3C2"],
    MET: ["MET/WETH-Uni10000", ETHUSD],
    OUSD: [],
    SD: ["SD/USDC-Uni3000"],
    SDT: ["SDT/WETH-Crv2C51", ETHUSD],
    SPELL: ["SPELL/WETH-Sushi", ETHUSD],
    TXJP: ["TXJP/WETH-Uni3000", ETHUSD],
    USDC: [],
    USDT: [],
    WETH: [ETHUSD],
    ZUN: ["ZUN/WETH-Crv2C22", ETHUSD],
    crvUSD: ["crvUSD/USDC-CrvSC0"],
    scrvUSD: ["scrvUSD/crvUSD-4626", "crvUSD/USDC-CrvSC0"],
    sdCRV: ["sdCRV/CRV-CrvSP300", "CRV/WETH-Crv3C4", ETHUSD]
  };
  const feeds: Array<string> = [];
  for (const token of tokens) {
    if (!prices[token]) continue;
    for (const feed of prices[token]) {
      if (!feeds.includes(feed)) feeds.push(feed);
    }
  }
  const multicall = Multicall3__factory.connect(MULTICALL_ADDRESS, provider);
  const calls: Array<ContractCall> = feeds.map((feed) => {
    return {
      interface: SpotPriceOracleInterface,
      address: "0xc2312CaF0De62eC9b4ADC785C79851Cb989C9abc",
      method: "getSpotPrice",
      parameters: [SpotPricePool[feed]],
    };
  });
  console.log("Fetch getSpotPrice, calls:", calls.length);
  const [, getSpotPriceResults] = await useMulticall(multicall, calls);
  const result: Record<string, number> = {};
  for (const token of tokens) {
    if (!prices[token]) continue;
    let price = 10n ** 18n;
    for (const feed of prices[token]) {
      const index = feeds.indexOf(feed);
      price = (price * BigInt(getSpotPriceResults[index][0])) / 10n ** 18n;
    }
    result[token] = parseFloat(ethers.formatEther(price));
  }
  return result;
}
