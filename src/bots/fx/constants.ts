import {
  ArbitrageProxy__factory,
  ERC20__factory,
  FxProtocolBatchExecutor__factory,
  FxProtocolExecutor__factory,
  FxUSDBasePool__factory,
  FxUSDRegeneracy__factory,
  ICurveStableSwapNG__factory,
  IPriceOracle__factory,
  IRateProvider__factory,
  MultiPathConverter__factory,
  PegKeeper__factory,
  PoolManager__factory,
} from "../../types";
import { encodeMultiPath, EthereumTokens, PATH_ENCODING } from "../../common";

export const CurveStableSwapNGInterface = ICurveStableSwapNG__factory.createInterface();
export const FxUSDBasePoolInterface = FxUSDBasePool__factory.createInterface();
export const FxUSDRegeneracyInterface = FxUSDRegeneracy__factory.createInterface();
export const MultiPathConverterInterface = MultiPathConverter__factory.createInterface();
export const PoolManagerInterface = PoolManager__factory.createInterface();
export const PegKeeperInterface = PegKeeper__factory.createInterface();
export const PriceOracleInterface = IPriceOracle__factory.createInterface();
export const RateProviderInterface = IRateProvider__factory.createInterface();
export const FxProtocolExecutorInterface = FxProtocolExecutor__factory.createInterface();
export const FxProtocolBatchExecutorInterface = FxProtocolBatchExecutor__factory.createInterface();
export const ArbitrageProxyInterface = ArbitrageProxy__factory.createInterface();
export const ERC20Interface = ERC20__factory.createInterface();

export const FXUSD_BASE_POOL = "0x65C9A641afCEB9C0E6034e558A319488FA0FA3be";
export const PEG_KEEPER = "0x50562fe7e870420F5AAe480B7F94EB4ace2fcd70";
export const POOL_MANAGER = "0x250893CA4Ba5d05626C785e8da758026928FCD24";
export const WSTETH_POOL = "0x6Ecfa38FeE8a5277B91eFdA204c235814F0122E8";
export const RESERVE_POOL = "0x297dD69725911FE5F08B8F8C5EDdDb724D7D11df";
export const USDC_fxUSD_CURVE_POOL = "0x5018BE882DccE5E3F2f3B0913AE2096B9b3fB61f";
export const MULTI_PATH_CONVERTER = "0x12AF4529129303D7FbD2563E242C4a2890525912";
export const ARBITRAGE_PROXY = "";

export const DefaultSwapRoute: {
  [poolAddr: string]: {
    encoding: bigint;
    routes: bigint[];
  };
} = {
  [WSTETH_POOL]: encodeMultiPath(
    [[PATH_ENCODING["wstETH/stETH_Lido"], PATH_ENCODING["stETH/WETH_CrvSB"], PATH_ENCODING["WETH/USDC_V3Uni500"]]],
    [100n],
  ),
};

export const PoolBaseToken: { [poolAddr: string]: string } = {
  [WSTETH_POOL]: EthereumTokens.wstETH.address,
};
