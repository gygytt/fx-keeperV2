import { assert } from "console";
import { getAddress, toBeHex, toBigInt } from "ethers";

import { Addresses } from "./address";
import { Action, encodePoolHintV3, PoolTypeV3 } from "./codec";
import { EthereumTokens } from "./tokens";

/* eslint-disable prettier/prettier */
// prettier-ignore
export const PATH_ENCODING: { [name: string]:  bigint } = {
  "AIOZ/WETH_V3Cake2500": encodePoolHintV3(Addresses["CakeV3_AIOZ/WETH_2500"], PoolTypeV3.UniswapV3, 2, 0, 1, Action.Swap, {fee_num: 2500}),
  "AIOZ/WETH_Crv2C90": encodePoolHintV3(Addresses["CRV_2C_WETH/AIOZ_90"], PoolTypeV3.CurveCryptoPool, 2, 1, 0, Action.Swap, {use_eth: false}),
  "AIOZ/WETH_V3Uni10000": encodePoolHintV3(Addresses["UniV3_AIOZ/WETH_10000"], PoolTypeV3.UniswapV3, 2, 0, 1, Action.Swap, {fee_num: 10000}),
  "ALCX/WETH_Sushi": encodePoolHintV3(Addresses["Sushi_WETH/ALCX"], PoolTypeV3.UniswapV2, 2, 1, 0, Action.Swap, { fee_num: 997000 }),
  "ALCX/WETH_BalV2W1211": encodePoolHintV3(Addresses["BalV2_W_WETH20/ALCX80_1211"], PoolTypeV3.BalancerV2, 2, 1, 0, Action.Swap),
  "CNC/WETH_Crv2C45": encodePoolHintV3(Addresses["CRV_2C_ETH/CNC_45"], PoolTypeV3.CurveCryptoPool, 2, 1, 0, Action.Swap, {use_eth: false}),
  "CRV/USDC_V3Uni10000": encodePoolHintV3(Addresses["UniV3_USDC/CRV_10000"], PoolTypeV3.UniswapV3, 2, 1, 0, Action.Swap, {fee_num: 10000}),
  "CRV/WETH_Crv3C4": encodePoolHintV3(Addresses["CRV_3C_crvUSD/ETH/CRV_4"], PoolTypeV3.CurveCryptoPool, 3, 2, 1, Action.Swap),
  "CRV/WETH_Sushi": encodePoolHintV3(Addresses["Sushi_WETH/CRV"], PoolTypeV3.UniswapV2, 2, 1, 0, Action.Swap, {fee_num: 997000}),
  "CRV/WETH_V2Uni": encodePoolHintV3(Addresses["UniV2_WETH/CRV"], PoolTypeV3.UniswapV2, 2, 1, 0, Action.Swap, {fee_num: 997000}),
  "CRV/WETH_V3Uni3000": encodePoolHintV3(Addresses["UniV3_WETH/CRV_3000"], PoolTypeV3.UniswapV3, 2, 1, 0, Action.Swap, {fee_num: 3000}),
  "CRV/crvUSD_Crv3C4": encodePoolHintV3(Addresses["CRV_3C_crvUSD/ETH/CRV_4"], PoolTypeV3.CurveCryptoPool, 3, 2, 0, Action.Swap),
  "DINERO/WETH_V3Uni3000": encodePoolHintV3(Addresses["UniV3_DINERO/WETH_3000"], PoolTypeV3.UniswapV3, 2, 0, 1, Action.Swap, {fee_num: 3000}),
  "DOLA/FRAXBP-CrvSP176": encodePoolHintV3(Addresses["CRV_SP_DOLA/FRAXBP_176"], PoolTypeV3.CurveMetaPool, 2, 0, 1, Action.Swap),
  "DOLA/WETH_V2Uni": encodePoolHintV3(Addresses["UniV2_DOLA/WETH"], PoolTypeV3.UniswapV2, 2, 0, 1, Action.Swap, {fee_num: 997000}),
  "FRAXBP/USDC-CrvSB": encodePoolHintV3(Addresses["CRV_SB_FRAX/USDC"], PoolTypeV3.CurvePlainPool, 2, 1, 1, Action.Remove),
  "FRAX/USDC_CrvSB": encodePoolHintV3(Addresses["CRV_SB_FRAX/USDC"], PoolTypeV3.CurvePlainPool, 2, 0, 1, Action.Swap),
  "FRAX/USDT_V3Uni500": encodePoolHintV3(Addresses["UniV3_FRAX/USDT_500"], PoolTypeV3.UniswapV3, 2, 0, 1, Action.Swap, {fee_num: 500}),
  "FRAX/WETH_Sushi": encodePoolHintV3(Addresses["Sushi_FRAX/WETH"], PoolTypeV3.UniswapV2, 2, 0, 1, Action.Swap, { fee_num: 997000 }),
  "FRAX/WETH_FraxSwap": encodePoolHintV3(Addresses["FraxSwap_FRAX/WETH"], PoolTypeV3.UniswapV2, 2, 0, 1, Action.Swap, {fee_num: 997000, twamm: true}),
  "FXN/WETH_Crv2C311": encodePoolHintV3(Addresses["CRV_2C_ETH/FXN_311"], PoolTypeV3.CurveCryptoPool, 2, 1, 0, Action.Swap),
  "FXS/FRAX_FraxSwap": encodePoolHintV3(Addresses["FraxSwap_FXS/FRAX"], PoolTypeV3.UniswapV2, 2, 0, 1, Action.Swap, {fee_num: 997000, twamm: true}),
  "FXS/FRAX_V2Uni": encodePoolHintV3(Addresses["UniV2_FXS/FRAX"], PoolTypeV3.UniswapV2, 2, 0, 1, Action.Swap, {fee_num: 997000, twamm: false}),
  "FXS/FRAX_V3Uni10000": encodePoolHintV3(Addresses["UniV3_FXS/FRAX_10000"], PoolTypeV3.UniswapV3, 2, 0, 1, Action.Swap, {fee_num: 10000}),
  "FXS/WETH_V3Uni10000": encodePoolHintV3(Addresses["UniV3_FXS/WETH_10000"], PoolTypeV3.UniswapV3, 2, 0, 1, Action.Swap, {fee_num: 10000}),
  "GHO/USDC_V3Uni500": encodePoolHintV3(Addresses["UniV3_GHO/USDC_500"], PoolTypeV3.UniswapV3, 2, 0, 1, Action.Swap, {fee_num: 500}),
  "GHO/USDT_V3Uni500": encodePoolHintV3(Addresses["UniV3_GHO/USDT_500"], PoolTypeV3.UniswapV3, 2, 0, 1, Action.Swap, {fee_num: 500}),
  "GHO/USDC_BalV2S1497": encodePoolHintV3(Addresses["BalV2_S_GHO/USDC/USDT_1497"], PoolTypeV3.BalancerV2, 4, 0, 2, Action.Swap),
  "INV/DOLA_Crv3C18": encodePoolHintV3(Addresses["CRV_3C_DOLA/DBR/INV_18"], PoolTypeV3.CurveCryptoPool, 3, 2, 0, Action.Swap, {use_eth: false}),
  "INV/WETH_Sushi": encodePoolHintV3(Addresses["Sushi_INV/WETH"], PoolTypeV3.UniswapV2, 2, 0, 1, Action.Swap, { fee_num: 997000 }),
  "INV/WETH_Crv2C101": encodePoolHintV3(Addresses["CRV_2C_WETH/INV_101"], PoolTypeV3.CurveCryptoPool, 2, 1, 0, Action.Swap, {use_eth: false}),
  "INV/WETH_Crv3C3": encodePoolHintV3(Addresses["CRV_3C_USDC/WETH/INV_3"], PoolTypeV3.CurveCryptoPool, 3, 2, 1, Action.Swap, {use_eth: false}),
  "MET/USDC_V3Uni3000": encodePoolHintV3(Addresses["UniV3_MET/USDC_3000"], PoolTypeV3.UniswapV3, 2, 0, 1, Action.Swap, {fee_num: 3000}),
  "MET/WETH_V3Uni10000": encodePoolHintV3(Addresses["UniV3_MET/WETH_10000"], PoolTypeV3.UniswapV3, 2, 0, 1, Action.Swap, {fee_num: 10000}),
  "SDT/WETH_V2Uni": encodePoolHintV3(Addresses["UniV2_SDT/WETH"], PoolTypeV3.UniswapV2, 2, 0, 1, Action.Swap, {fee_num: 997000, twamm: false}),
  "SPELL/WETH_Crv2C": encodePoolHintV3(Addresses["CRV_2C_ETH/SPELL"], PoolTypeV3.CurveCryptoPool, 2, 1, 0, Action.Swap),
  "SPELL/WETH_Sushi": encodePoolHintV3(Addresses["Sushi_SPELL/WETH"], PoolTypeV3.UniswapV2, 2, 0, 1, Action.Swap, { fee_num: 997000 }),
  "SPELL/WETH_V3Uni10000": encodePoolHintV3(Addresses["UniV3_SPELL/WETH_10000"], PoolTypeV3.UniswapV3, 2, 0, 1, Action.Swap, {fee_num: 10000}),
  "SPELL/WETH_V3Uni3000": encodePoolHintV3(Addresses["UniV3_SPELL/WETH_3000"], PoolTypeV3.UniswapV3, 2, 0, 1, Action.Swap, {fee_num: 3000}),
  "TXJP/WETH_BalV2W610": encodePoolHintV3(Addresses["BalV2_W_TXJP98/WETH2_610"], PoolTypeV3.BalancerV2, 2, 0, 1, Action.Swap),
  "TXJP/WETH_V3Uni3000": encodePoolHintV3(Addresses["UniV3_TXJP/WETH_3000"], PoolTypeV3.UniswapV3, 2, 0, 1, Action.Swap, { fee_num: 3000 }),
  "USDC/CVX_V3Uni3000": encodePoolHintV3(Addresses["UniV3_CVX/USDC_3000"], PoolTypeV3.UniswapV3, 2, 1, 0, Action.Swap, { fee_num: 3000 }),
  "USDC/USDT_CrvSB": encodePoolHintV3(Addresses["CRV_SB_DAI/USDC/USDT"], PoolTypeV3.CurvePlainPool, 3, 1, 2, Action.Swap),
  "USDC/WBTC_V3Uni3000": encodePoolHintV3(Addresses["UniV3_WBTC/USDC_3000"], PoolTypeV3.UniswapV3, 2, 1, 0, Action.Swap, {fee_num: 3000}),
  "USDC/WETH_Sushi": encodePoolHintV3(Addresses["Sushi_USDC/WETH"], PoolTypeV3.UniswapV2, 2, 0, 1, Action.Swap, { fee_num: 997000 }),
  "USDC/WETH_V3Uni500": encodePoolHintV3(Addresses["UniV3_USDC/WETH_500"], PoolTypeV3.UniswapV3, 2, 0, 1, Action.Swap, {fee_num: 500}),
  "USDC/fxUSD_CrvSN193": encodePoolHintV3(Addresses["CRV_SN_USDC/fxUSD_193"], PoolTypeV3.CurveStableSwapNG, 2, 0, 1, Action.Swap),
  "USDT/WETH_V3Uni500": encodePoolHintV3(Addresses["UniV3_WETH/USDT_500"], PoolTypeV3.UniswapV3, 2, 1, 0, Action.Swap, {fee_num: 500}),
  "USDT/USDC_CrvSB": encodePoolHintV3(Addresses["CRV_SB_DAI/USDC/USDT"], PoolTypeV3.CurvePlainPool, 3, 2, 1, Action.Swap),
  "WBTC/USDC_V3Uni3000": encodePoolHintV3(Addresses["UniV3_WBTC/USDC_3000"], PoolTypeV3.UniswapV3, 2, 0, 1, Action.Swap, {fee_num: 3000}),
  "WETH/CVX_Crv2C": encodePoolHintV3(Addresses["CRV_2C_ETH/CVX"], PoolTypeV3.CurveCryptoPool, 2, 0, 1, Action.Swap),
  "WETH/CVX_Sushi": encodePoolHintV3(Addresses["Sushi_CVX/WETH"], PoolTypeV3.UniswapV2, 2, 1, 0, Action.Swap, { fee_num: 997000 }),
  "WETH/SDT_Crv2C11": encodePoolHintV3(Addresses["CRV_2C_ETH/SDT_11"], PoolTypeV3.CurveCryptoPool, 2, 0, 1, Action.Swap, {use_eth: true}),
  "WETH/SDT_Crv2C51": encodePoolHintV3(Addresses["CRV_2C_WETH/SDT_51"], PoolTypeV3.CurveCryptoPool, 2, 0, 1, Action.Swap),
  "WETH/SDT_CakeV3": encodePoolHintV3(Addresses["CakeV3_SDT/WETH_2500"], PoolTypeV3.UniswapV3, 2, 1, 0, Action.Swap, {fee_num: 2500}),
  "WETH/SDT_V2Uni": encodePoolHintV3(Addresses["UniV2_SDT/WETH"], PoolTypeV3.UniswapV2, 2, 1, 0, Action.Swap, {fee_num: 997000}),
  "WETH/USDC_V3Uni500": encodePoolHintV3(Addresses["UniV3_USDC/WETH_500"], PoolTypeV3.UniswapV3, 2, 1, 0, Action.Swap, {fee_num: 500}),
  "WETH/USDT_V3Uni500": encodePoolHintV3(Addresses["UniV3_WETH/USDT_500"], PoolTypeV3.UniswapV3, 2, 0, 1, Action.Swap, {fee_num: 500}),
  "WETH/stETH_Lido": encodePoolHintV3(EthereumTokens.stETH.address, PoolTypeV3.Lido, 2, 0, 0, Action.Add),
  "ZUN/WETH_Crv2C22": encodePoolHintV3(Addresses["CRV_2C_WETH/ZUN_22"], PoolTypeV3.CurveCryptoPool, 2, 1, 0, Action.Swap),
  "crvUSD/WETH_Crv3C4": encodePoolHintV3(Addresses["CRV_3C_crvUSD/ETH/CRV_4"], PoolTypeV3.CurveCryptoPool, 3, 0, 1, Action.Swap),
  "frxETH/WETH_CrvSC15": encodePoolHintV3(Addresses["CRV_SC_WETH/frxETH_15"], PoolTypeV3.CurvePlainPool, 2, 1, 0, Action.Swap),
  "fxUSD/USDC_CrvSN193": encodePoolHintV3(Addresses["CRV_SN_USDC/fxUSD_193"], PoolTypeV3.CurveStableSwapNG, 2, 1, 0, Action.Swap),
  "sfrxETH/frxETH_Frax": encodePoolHintV3(EthereumTokens.sfrxETH.address, PoolTypeV3.ERC4626, 2, 0, 0, Action.Remove),
  "sdCRV/CRV_CrvSP300": encodePoolHintV3(Addresses["CRV_SP_CRV/sdCRV_300"], PoolTypeV3.CurvePlainPool, 2, 1, 0, Action.Swap),
  "stETH/WETH_CrvSB": encodePoolHintV3(Addresses["CRV_SB_ETH/stETH"], PoolTypeV3.CurvePlainPool, 2, 1, 0, Action.Swap),
  "stETH/wstETH_Lido": encodePoolHintV3(EthereumTokens.wstETH.address, PoolTypeV3.Lido, 2, 0, 0, Action.Add),
  "wstETH/WETH_V3Uni100": encodePoolHintV3(Addresses["UniV3_wstETH/WETH_100"], PoolTypeV3.UniswapV3, 2, 0, 1, Action.Swap, {fee_num: 100}),
  "wstETH/stETH_Lido": encodePoolHintV3(EthereumTokens.wstETH.address, PoolTypeV3.Lido, 2, 0, 0, Action.Remove),
};
/* eslint-enable prettier/prettier */

export function encodeMultiPath(
  paths: (bigint | bigint[])[],
  parts: bigint[],
): {
  encoding: bigint;
  routes: bigint[];
} {
  assert(parts.length === paths.length, "mismatch array length");
  const sum = parts.reduce((sum, v) => sum + v, 0n);
  const routes = [];
  let encoding = 0n;
  let offset = 0;
  for (let i = 0; i < parts.length; ++i) {
    if (parts[i] === 0n) continue;
    const ratio = (parts[i] * toBigInt(0xfffff)) / sum;
    let length: bigint;
    if (typeof paths[i] === "bigint") {
      length = 1n;
      routes.push(paths[i] as bigint);
    } else if (typeof paths[i] === "object") {
      length = toBigInt((paths[i] as bigint[]).length);
      routes.push(...(paths[i] as bigint[]));
    } else {
      throw Error("invalid paths");
    }
    encoding |= ((length << 20n) | ratio) << toBigInt(offset * 32);
    offset += 1;
  }
  return { encoding, routes };
}

/* eslint-disable prettier/prettier */
// prettier-ignore
export const MULTI_PATH_CONVERTER_ROUTES: {
  [from: string]: {
    [to: string]: {
      encoding: bigint;
      routes: bigint[];
    };
  };
} = {
  AIOZ: {
    WETH: encodeMultiPath(
      [PATH_ENCODING["AIOZ/WETH_V3Uni10000"], PATH_ENCODING["AIOZ/WETH_V3Cake2500"], PATH_ENCODING["AIOZ/WETH_Crv2C90"]],
      [12n, 14n, 74n]
    ),
  },
  ALCX: {
    WETH: encodeMultiPath([PATH_ENCODING["ALCX/WETH_Sushi"], PATH_ENCODING["ALCX/WETH_BalV2W1211"]], [100n, 0n]),
  },
  CNC: {
    WETH: encodeMultiPath([PATH_ENCODING["CNC/WETH_Crv2C45"]], [100n]),
  },
  CRV: {
    WETH: encodeMultiPath([PATH_ENCODING["CRV/WETH_V3Uni3000"], PATH_ENCODING["CRV/WETH_Crv3C4"]], [0n, 100n]),
  },
  DINERO: {
    WETH: encodeMultiPath([PATH_ENCODING["DINERO/WETH_V3Uni3000"]], [100n]),
  },
  FXN: {
    WETH: encodeMultiPath([PATH_ENCODING["FXN/WETH_Crv2C311"]], [100n]),
  },
  FXS: {
    WETH: encodeMultiPath(
      [
        [PATH_ENCODING["FXS/FRAX_FraxSwap"], PATH_ENCODING["FRAX/WETH_FraxSwap"]],
        [PATH_ENCODING["FXS/WETH_V3Uni10000"]]
      ],
      [100n, 0n]
    ),
  },
  GHO: {
    WETH: encodeMultiPath(
      [
        [PATH_ENCODING["GHO/USDC_BalV2S1497"], PATH_ENCODING["USDC/WETH_V3Uni500"]],
        [PATH_ENCODING["GHO/USDC_V3Uni500"], PATH_ENCODING["USDC/WETH_V3Uni500"]],
      ],
      [100n, 0n]
    ),
  },
  INV: {
    WETH: encodeMultiPath(
      [
        PATH_ENCODING["INV/WETH_Sushi"], PATH_ENCODING["INV/WETH_Crv3C3"], PATH_ENCODING["INV/WETH_Crv2C101"],
        [PATH_ENCODING["INV/DOLA_Crv3C18"], PATH_ENCODING["DOLA/FRAXBP-CrvSP176"], PATH_ENCODING["FRAXBP/USDC-CrvSB"], PATH_ENCODING["USDC/WETH_V3Uni500"]],
      ],
      [0n, 8n, 92n, 0n]
    ),
  },
  MET: {
    WETH: encodeMultiPath(
      [PATH_ENCODING["MET/WETH_V3Uni10000"], [PATH_ENCODING["MET/USDC_V3Uni3000"], PATH_ENCODING["USDC/WETH_V3Uni500"]]],
      [0n, 100n]
    ),
  },
  SDT: {
    WETH: encodeMultiPath([PATH_ENCODING["SDT/WETH_V2Uni"]], [100n]),
  },
  SPELL: {
    WETH: encodeMultiPath(
      [PATH_ENCODING["SPELL/WETH_Sushi"], PATH_ENCODING["SPELL/WETH_V3Uni10000"], PATH_ENCODING["SPELL/WETH_V3Uni3000"], PATH_ENCODING["SPELL/WETH_Crv2C"]],
      [76n, 8n, 14n, 2n]
    ),
  },
  TXJP: {
    WETH: encodeMultiPath([PATH_ENCODING["TXJP/WETH_V3Uni3000"], PATH_ENCODING["TXJP/WETH_BalV2W610"]], [100n, 0n]),
  },
  USDC: {
    WBTC: encodeMultiPath([PATH_ENCODING["USDC/WBTC_V3Uni3000"]], [100n]),
    WETH: encodeMultiPath([PATH_ENCODING["USDC/WETH_V3Uni500"]], [100n]),
    fxUSD: encodeMultiPath([PATH_ENCODING["USDC/fxUSD_CrvSN193"]], [100n]),
    wstETH: encodeMultiPath(
      [[PATH_ENCODING["USDC/WETH_V3Uni500"], PATH_ENCODING["WETH/stETH_Lido"], PATH_ENCODING["stETH/wstETH_Lido"]]],
      [100n]
    ),
  },
  USDT: {
    WBTC: encodeMultiPath([[PATH_ENCODING["USDT/USDC_CrvSB"], PATH_ENCODING["USDC/WBTC_V3Uni3000"]]], [100n]),
    WETH: encodeMultiPath([PATH_ENCODING["USDT/WETH_V3Uni500"]], [100n]),
    wstETH: encodeMultiPath(
      [[PATH_ENCODING["USDT/USDC_CrvSB"], PATH_ENCODING["USDC/WETH_V3Uni500"], PATH_ENCODING["WETH/stETH_Lido"], PATH_ENCODING["stETH/wstETH_Lido"]]],
      [100n]
    ),
  },
  WBTC: {
    USDC: encodeMultiPath([PATH_ENCODING["WBTC/USDC_V3Uni3000"]], [100n]),
    USDT: encodeMultiPath([[PATH_ENCODING["WBTC/USDC_V3Uni3000"], PATH_ENCODING["USDC/USDT_CrvSB"]]], [100n]),
    fxUSD: encodeMultiPath(
      [[PATH_ENCODING["WBTC/USDC_V3Uni3000"], PATH_ENCODING["USDC/fxUSD_CrvSN193"]]],
      [100n]
    ),
  },
  WETH: {
    CVX: encodeMultiPath(
      [
        [PATH_ENCODING["WETH/USDC_V3Uni500"], PATH_ENCODING["USDC/CVX_V3Uni3000"]],
        [PATH_ENCODING["WETH/CVX_Sushi"]],
        [PATH_ENCODING["WETH/CVX_Crv2C"]]
      ],
      [0n, 0n, 96n]
    ),
    USDC: encodeMultiPath([PATH_ENCODING["WETH/USDC_V3Uni500"]], [100n]),
    USDT: encodeMultiPath([PATH_ENCODING["WETH/USDT_V3Uni500"]], [100n]),
    fxUSD: encodeMultiPath(
      [[PATH_ENCODING["WETH/USDC_V3Uni500"], PATH_ENCODING["USDC/fxUSD_CrvSN193"]]],
      [100n]
    ),
    wstETH: encodeMultiPath(
      [[PATH_ENCODING["WETH/stETH_Lido"], PATH_ENCODING["stETH/wstETH_Lido"]]],
      [100n]
    ),
  },
  ZUN: {
    WETH: encodeMultiPath([PATH_ENCODING["ZUN/WETH_Crv2C22"]], [100n]),
  },
  crvUSD: {
    WETH: encodeMultiPath([PATH_ENCODING["crvUSD/WETH_Crv3C4"]], [100n]),
  },
  fxUSD: {
    USDC: encodeMultiPath([PATH_ENCODING["fxUSD/USDC_CrvSN193"]], [100n]),
    WBTC: encodeMultiPath([[PATH_ENCODING["fxUSD/USDC_CrvSN193"], PATH_ENCODING["USDC/WBTC_V3Uni3000"]]], [100n]),
    WETH: encodeMultiPath([[PATH_ENCODING["fxUSD/USDC_CrvSN193"], PATH_ENCODING["USDC/WETH_V3Uni500"]]], [100n]),
    wstETH: encodeMultiPath(
      [[PATH_ENCODING["fxUSD/USDC_CrvSN193"], PATH_ENCODING["USDC/WETH_V3Uni500"], PATH_ENCODING["WETH/stETH_Lido"], PATH_ENCODING["stETH/wstETH_Lido"]]],
      [100n]
    ),
  },
  sdCRV: {
    SDT: encodeMultiPath(
      [
        [PATH_ENCODING["sdCRV/CRV_CrvSP300"], PATH_ENCODING["CRV/WETH_V3Uni3000"], PATH_ENCODING["WETH/SDT_V2Uni"]],
        [PATH_ENCODING["sdCRV/CRV_CrvSP300"], PATH_ENCODING["CRV/WETH_Crv3C4"], PATH_ENCODING["WETH/SDT_Crv2C51"]],
        [PATH_ENCODING["sdCRV/CRV_CrvSP300"], PATH_ENCODING["CRV/WETH_Crv3C4"], PATH_ENCODING["WETH/SDT-Crv2C11"]],
      ],
      [2234n, 7666n, 0n]
    )
  },
  sfrxETH: {
    wstETH: encodeMultiPath(
      [[PATH_ENCODING["sfrxETH/frxETH_Frax"], PATH_ENCODING["frxETH/WETH_CrvSC15"], PATH_ENCODING["WETH/stETH_Lido"], PATH_ENCODING["stETH/wstETH_Lido"]]],
      [100n]
    ),
  },
  stETH: {
    wstETH: encodeMultiPath([PATH_ENCODING["stETH/wstETH_Lido"]], [100n])
  },
  wstETH: {
    USDC: encodeMultiPath([[PATH_ENCODING["wstETH/stETH_Lido"], PATH_ENCODING["stETH/WETH_CrvSB"], PATH_ENCODING["WETH/USDC_V3Uni500"]]], [100n]),
    USDT: encodeMultiPath([[PATH_ENCODING["wstETH/stETH_Lido"], PATH_ENCODING["stETH/WETH_CrvSB"], PATH_ENCODING["WETH/USDT_V3Uni500"]]], [100n]),
    WETH: encodeMultiPath([[PATH_ENCODING["wstETH/stETH_Lido"], PATH_ENCODING["stETH/WETH_CrvSB"]]], [100n]),
    fxUSD: encodeMultiPath(
      [[PATH_ENCODING["wstETH/stETH_Lido"], PATH_ENCODING["stETH/WETH_CrvSB"], PATH_ENCODING["WETH/USDC_V3Uni500"], PATH_ENCODING["USDC/fxUSD_CrvSN193"]]],
      [100n]
    ),
    stETH: encodeMultiPath([PATH_ENCODING["wstETH/stETH_Lido"]], [100n])
  }
};
/* eslint-enable prettier/prettier */

export function showMultiPathRoutes(src: string, dst: string, space?: number) {
  let { encoding, routes } = MULTI_PATH_CONVERTER_ROUTES[src][dst];
  let offset = 0;
  while (encoding !== 0n) {
    const ratio = encoding & 1048575n;
    const length = Number((encoding >> 20n) & 4095n);
    const pools = routes.slice(offset, offset + length).map((route, index) => {
      const name = Object.entries(PATH_ENCODING).find(([x, y]) => y.toString() === route.toString())![0];
      const pool = getAddress(toBeHex((route >> 10n) & 0xffffffffffffffffffffffffffffffffffffffffn));
      return [name, pool];
    });
    console.log(" ".repeat(space ?? 0), `${((Number(ratio) * 100) / 1048575).toFixed(2)}%:`);
    pools.forEach(([name, pool]) => {
      const [, protocol] = name.split("_");
      const [src, dst] = name.split("_")[0].split("/");
      console.log(" ".repeat((space ?? 0) + 2), `${src} ==> ${dst} with ${protocol}[${pool}]`);
    });
    encoding >>= 32n;
    offset += length;
  }
}
