// SPDX-License-Identifier: MIT

pragma solidity ^0.8.26;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// solhint-disable no-console

import { Script } from "forge-std/Script.sol";
import { console } from "forge-std/console.sol";

import { FxProtocolExecutor } from "../src/executor/FxProtocolExecutor.sol";
import { FxProtocolBatchExecutor } from "../src/executor/FxProtocolBatchExecutor.sol";
import { ArbitrageProxy } from "../src/ArbitrageProxy.sol";

// solhint-disable state-visibility
// solhint-disable var-name-mixedcase

contract Deploy is Script {
  uint256 PRIVATE_KEY = vm.envUint("PRIVATE_KEY");

  address private constant USDC = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;
  address private constant fxUSD = 0x085780639CC2cACd35E474e71f4d000e2405d8f6;
  address private constant PoolManager = 0x250893CA4Ba5d05626C785e8da758026928FCD24;
  address private constant FxBase = 0x65C9A641afCEB9C0E6034e558A319488FA0FA3be;
  address private constant USDC_fxUSD_POOL = 0x5018BE882DccE5E3F2f3B0913AE2096B9b3fB61f;

  function run() external {
    bytes32 salt = keccak256(abi.encode(vm.envString("SALT")));
    vm.startBroadcast(PRIVATE_KEY);
    address deployer = vm.addr(PRIVATE_KEY);
    console.log("deployer----: ", deployer);

    address[] memory _managers = new address[](2);
    address[] memory _operators = new address[](3);
    _managers[0] = deployer;
    _operators[0] = address(0x0000000000000000000000000000000000000000);

    FxProtocolExecutor executor = new FxProtocolExecutor{ salt: salt }();
    FxProtocolBatchExecutor batchExecutor = new FxProtocolBatchExecutor{ salt: salt }();
    logAddress("FxProtocolExecutor", address(executor));
    logAddress("FxProtocolBatchExecutor", address(batchExecutor));
    ArbitrageProxy proxy = new ArbitrageProxy{ salt: salt }(_managers, _operators);
    logAddress("ArbitrageProxy", address(proxy));

    /*
    FxProtocolExecutor executor = FxProtocolExecutor(address(0));
    FxProtocolBatchExecutor batchExecutor = FxProtocolBatchExecutor(address(0));
    ArbitrageProxy proxy = ArbitrageProxy(payable(address(0)));
    */

    proxy.updateImpl(FxProtocolExecutor.run.selector, address(executor));
    proxy.updateImpl(FxProtocolBatchExecutor.liquidate.selector, address(batchExecutor));
    proxy.updateImpl(FxProtocolBatchExecutor.rebalanceOrLiquidate.selector, address(batchExecutor));
    // maximum approve:
    // + USDC,fxUSD to USDC_fxUSD_POOL
    // + fxUSD, USDC to PoolManager and fxBASE
    proxy.rescue(fxUSD, 0, abi.encodeCall(IERC20.approve, (USDC_fxUSD_POOL, type(uint256).max)));
    proxy.rescue(USDC, 0, abi.encodeCall(IERC20.approve, (USDC_fxUSD_POOL, type(uint256).max)));
    proxy.rescue(fxUSD, 0, abi.encodeCall(IERC20.approve, (PoolManager, type(uint256).max)));
    proxy.rescue(USDC, 0, abi.encodeCall(IERC20.approve, (FxBase, type(uint256).max)));
    proxy.rescue(fxUSD, 0, abi.encodeCall(IERC20.approve, (FxBase, type(uint256).max)));

    vm.stopBroadcast();
  }

  function logAddress(string memory name, address addr) internal pure {
    console.log(string(abi.encodePacked(name, "=", vm.toString(address(addr)))));
  }
}
