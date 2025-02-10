// SPDX-License-Identifier: MIT

pragma solidity ^0.8.26;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import { IBalancerVault } from "../interfaces/IBalancerVault.sol";
import { ICurveStableSwapNG } from "../interfaces/ICurveStableSwapNG.sol";
import { IFxUSDBasePool } from "../interfaces/IFxUSDBasePool.sol";
import { IFlashLoanRecipient } from "../interfaces/IFlashLoanRecipient.sol";

contract FxProtocolExecutor is IFlashLoanRecipient {
  address private constant fxUSD = 0x085780639CC2cACd35E474e71f4d000e2405d8f6;

  address private constant USDC = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;

  address private constant wstETH = 0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0;

  address private constant BALANCER = 0xBA12222222228d8Ba445958a75a0704d566BF2C8;

  address private constant USDC_fxUSD_POOL = 0x5018BE882DccE5E3F2f3B0913AE2096B9b3fB61f;

  // Support FxBase.rebalance, FxBase.liquidate and PoolManager.redeem
  function run(uint256 borrow, bytes calldata data) external {
    address[] memory tokens = new address[](1);
    uint256[] memory amounts = new uint256[](1);
    tokens[0] = USDC;
    amounts[0] = borrow;
    IBalancerVault(BALANCER).flashLoan(address(this), tokens, amounts, data);
  }

  function receiveFlashLoan(
    address[] memory,
    uint256[] memory amounts,
    uint256[] memory feeAmounts,
    bytes memory userData
  ) external {
    (bool useFxUSD, address fxTarget, bytes memory fxData, address swapTarget, bytes memory swapData) = abi.decode(
      userData,
      (bool, address, bytes, address, bytes)
    );

    // swap all borrowed USDC to fxUSD
    if (useFxUSD) {
      ICurveStableSwapNG(USDC_fxUSD_POOL).exchange(0, 1, amounts[0], 0);
    }

    // liquidate/rebalance through fxBASE, redeem through PoolManager
    (bool success, ) = fxTarget.call(fxData);
    _popupRevertReason(success);

    // swap all wstETH to USDC using dex aggregator
    IERC20(wstETH).approve(swapTarget, IERC20(wstETH).balanceOf(address(this)));
    (success, ) = swapTarget.call(swapData);
    _popupRevertReason(success);

    // swap all remained fxUSD to USDC
    if (useFxUSD) {
      uint256 balance = IERC20(fxUSD).balanceOf(address(this));
      if (balance >= 1 ether) {
        ICurveStableSwapNG(USDC_fxUSD_POOL).exchange(1, 0, balance, 0);
      }
    }

    // repay debts
    IERC20(USDC).transfer(BALANCER, amounts[0] + feeAmounts[0]);
  }

  function _popupRevertReason(bool success) internal pure {
    // below lines will propagate inner error up
    if (!success) {
      // solhint-disable-next-line no-inline-assembly
      assembly {
        let ptr := mload(0x40)
        let size := returndatasize()
        returndatacopy(ptr, 0, size)
        revert(ptr, size)
      }
    }
  }
}
