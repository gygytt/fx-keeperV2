import { Addresses } from "./address";
import { encodeSpotPricePool, encodeSpotPriceSources, SpotPricePoolType } from "./codec";
import { EthereumTokens } from "./tokens";

export const ChainlinkPriceFeed: {
  [network: string]: {
    [name: string]: {
      feed: string;
      scale: bigint;
      heartbeat: number;
    };
  };
} = {
  ethereum: {
    "USDC-USD": {
      feed: "0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6",
      scale: 10n ** (18n - 8n),
      heartbeat: ((86400 * 3) / 2) * 100000, // 1.5 multiple
    },
    "ETH-USD": {
      feed: "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419",
      scale: 10n ** (18n - 8n),
      heartbeat: 3600 * 3, // 3 multiple
    },
    "stETH-USD": {
      feed: "0xCfE54B5cD566aB89272946F602D76Ea879CAb4a8",
      scale: 10n ** (18n - 8n),
      heartbeat: 3600 * 3 * 100000, // 3 multiple
    },
  },
};

/* eslint-disable prettier/prettier */
// prettier-ignore
export const SpotPricePool: { [name: string]: bigint } = {
  "AIOZ/WETH-Crv2C90": encodeSpotPricePool(Addresses["CRV_2C_WETH/AIOZ_90"], SpotPricePoolType.CurveCrypto, {base_index: 1}),
  "ALCX/WETH-Sushi": encodeSpotPricePool(Addresses["Sushi_WETH/ALCX"], SpotPricePoolType.UniswapV2, {base_index: 1, base_scale: 0, quote_scale: 0}),
  "CNC/WETH-Crv2C45": encodeSpotPricePool(Addresses["CRV_2C_ETH/CNC_45"], SpotPricePoolType.CurveCrypto, {base_index: 1}),
  "CJPY/WETH-Crv2C5": encodeSpotPricePool(Addresses["CRV_2C_WETH/CJPY_5"], SpotPricePoolType.CurveCrypto, {base_index: 1}),
  "CRV/WETH-Crv3C4": encodeSpotPricePool(Addresses["CRV_3C_crvUSD/ETH/CRV_4"], SpotPricePoolType.CurveTriCrypto, {base_index: 2, quote_index: 1}),
  "CVG/WETH-Crv2C0": encodeSpotPricePool(Addresses["CRV_2C_WETH/CVG_0"], SpotPricePoolType.CurveCrypto, {base_index: 1}),
  "CVX/WETH-Crv2C": encodeSpotPricePool(Addresses["CRV_2C_ETH/CVX"], SpotPricePoolType.CurveCrypto, {base_index: 1}),
  "DINERO/WETH-Uni3000": encodeSpotPricePool(Addresses["UniV3_DINERO/WETH_3000"], SpotPricePoolType.UniswapV3, {base_index: 0, base_scale: 0, quote_scale: 0}),
  "FRAX/USDC-CrvSB": encodeSpotPricePool(Addresses["CRV_SB_FRAX/USDC"], SpotPricePoolType.CurvePlain, {tokens: 2, base_index: 0, quote_index: 0, has_amm_precise: true, scales: [0, 12]}),
  "FXN/WETH-Crv2C311": encodeSpotPricePool(Addresses["CRV_2C_ETH/FXN_311"], SpotPricePoolType.CurveCrypto, {base_index: 1}),
  "FXS/FRAX-Uni10000": encodeSpotPricePool(Addresses["UniV3_FXS/FRAX_10000"], SpotPricePoolType.UniswapV3, {base_index: 0, base_scale: 0, quote_scale: 0}),
  "GHO/USDC-BalV2S1497": encodeSpotPricePool(Addresses["BalV2_S_GHO/USDC/USDT_1497"], SpotPricePoolType.BalancerV2Stable, {base_index: 0, quote_index: 1}),
  "GMAC/WETH-Uni": encodeSpotPricePool(Addresses["UniV2_WETH/GMAC"], SpotPricePoolType.UniswapV2, {base_index: 1, base_scale: 0, quote_scale: 0}),
  "INV/USDC-Crv3C2": encodeSpotPricePool(Addresses["CRV_3C_USDC/WETH/INV_3"], SpotPricePoolType.CurveTriCrypto, {base_index: 2, quote_index: 0}),
  "MET/WETH-Uni10000": encodeSpotPricePool(Addresses["UniV3_MET/WETH_10000"], SpotPricePoolType.UniswapV3, {base_index: 0, base_scale: 0, quote_scale: 0}),
  "SD/USDC-Uni3000": encodeSpotPricePool(Addresses["UniV3_SD/USDC_3000"], SpotPricePoolType.UniswapV3, {base_index: 0, base_scale: 0, quote_scale: 12}),
  "SDT/WETH-Crv2C51": encodeSpotPricePool(Addresses["CRV_2C_WETH/SDT_51"], SpotPricePoolType.CurveCrypto, {base_index: 1}),
  "SPELL/WETH-Sushi": encodeSpotPricePool(Addresses["Sushi_SPELL/WETH"], SpotPricePoolType.UniswapV2, {base_index: 0, base_scale: 0, quote_scale: 0}),
  "TXJP/WETH-Uni3000": encodeSpotPricePool(Addresses["UniV3_TXJP/WETH_3000"], SpotPricePoolType.UniswapV3, {base_index: 0, base_scale: 10, quote_scale: 0}),
  "WETH/USDC-Uni": encodeSpotPricePool(Addresses["UniV2_USDC/WETH"], SpotPricePoolType.UniswapV2, {base_index: 1, base_scale: 0, quote_scale: 12}),
  "WETH/USDC-Uni500": encodeSpotPricePool(Addresses["UniV3_USDC/WETH_500"], SpotPricePoolType.UniswapV3, {base_index: 1, base_scale: 0, quote_scale: 12}),
  "WETH/USDC-Uni3000": encodeSpotPricePool(Addresses["UniV3_USDC/WETH_3000"], SpotPricePoolType.UniswapV3, {base_index: 1, base_scale: 0, quote_scale: 12}),
  "ZUN/WETH-Crv2C22": encodeSpotPricePool(Addresses["CRV_2C_WETH/ZUN_22"], SpotPricePoolType.CurveCrypto, {base_index: 1}),
  "crvUSD/USDC-CrvSC0": encodeSpotPricePool(Addresses["CRV_SC_USDC/crvUSD_0"], SpotPricePoolType.CurvePlainWithOracle, {base_index: 1, use_cache: true}),
  "scrvUSD/crvUSD-4626": encodeSpotPricePool(EthereumTokens.scrvUSD.address, SpotPricePoolType.ERC4626, {base_is_underlying: false}),
  "sdCRV/CRV-CrvSP300": encodeSpotPricePool(Addresses["CRV_SP_CRV/sdCRV_300"], SpotPricePoolType.CurvePlainWithOracle, {base_index: 1, use_cache: true}),
  "stETH/WETH-BalV2S1474": encodeSpotPricePool(Addresses["BalV2_S_wstETH/WETH_1474"], SpotPricePoolType.BalancerV2Stable, {base_index: 0, quote_index: 1}),
  "stETH/WETH-CrvSB": encodeSpotPricePool(Addresses["CRV_SB_ETH/stETH"], SpotPricePoolType.CurvePlain, {tokens: 2, base_index: 1, quote_index: 0, has_amm_precise: true, scales: [0, 0]}),
  "stETH/WETH-CrvSP303": encodeSpotPricePool(Addresses["CRV_SP_ETH/stETH_303"], SpotPricePoolType.CurvePlainWithOracle, {base_index: 1, use_cache: true}),
  "stETH/wstETH-LSD": encodeSpotPricePool(EthereumTokens.wstETH.address, SpotPricePoolType.ETHLSD, {base_is_ETH: true}),
  "wstETH/WETH-Uni100": encodeSpotPricePool(Addresses["UniV3_wstETH/WETH_100"], SpotPricePoolType.UniswapV3, {base_index: 0, base_scale: 0, quote_scale: 0}),
};

// prettier-ignore
export const SpotPriceEncodings: { [pair: string]: string } = {
  "WETH/USDC": encodeSpotPriceSources([
    [SpotPricePool["WETH/USDC-Uni"]],
    [SpotPricePool["WETH/USDC-Uni500"]],
    [SpotPricePool["WETH/USDC-Uni3000"]],
  ]),
  "stETH/WETH": encodeSpotPriceSources([
    [SpotPricePool["stETH/wstETH-LSD"], SpotPricePool["wstETH/WETH-Uni100"]],
    [SpotPricePool["stETH/WETH-BalV2S1474"]],
    [SpotPricePool["stETH/WETH-CrvSP303"]],
    [SpotPricePool["stETH/WETH-CrvSB"]],
  ]),
}
/* eslint-enable prettier/prettier */
