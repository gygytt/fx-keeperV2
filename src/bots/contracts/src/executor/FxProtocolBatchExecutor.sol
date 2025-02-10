// SPDX-License-Identifier: MIT

pragma solidity ^0.8.26;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import { IMorpho } from "../interfaces/IMorpho.sol";
import { ICurveStableSwapNG } from "../interfaces/ICurveStableSwapNG.sol";
import { IFxUSDBasePool } from "../interfaces/IFxUSDBasePool.sol";
import { IPool } from "../interfaces/IPool.sol";
import { IMorphoFlashLoanCallback } from "../interfaces/IMorphoFlashLoanCallback.sol";

contract FxProtocolBatchExecutor is IMorphoFlashLoanCallback {
  using SafeERC20 for IERC20;

  address private constant fxUSD = 0x085780639CC2cACd35E474e71f4d000e2405d8f6;

  address private constant USDC = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;

  address private constant MORPHO = 0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb;

  address private constant fxBASE = 0x65C9A641afCEB9C0E6034e558A319488FA0FA3be;

  address private constant USDC_fxUSD_POOL = 0x5018BE882DccE5E3F2f3B0913AE2096B9b3fB61f;

  function liquidate(address pool, address token, uint256 encoding) external {
    uint256 balance = IERC20(token).balanceOf(address(this));
    while (true) {
      uint256 position = encoding % 4294967296;
      if (position == 0) break;
      (uint256 tokenUsed, ) = IFxUSDBasePool(fxBASE).liquidate(pool, uint32(position), token, balance, 0);
      balance -= tokenUsed;
      encoding >>= 32;
    }
  }

  function rebalanceOrLiquidate(uint256 borrowAmount, bytes calldata data) external {
    IERC20(USDC).forceApprove(MORPHO, borrowAmount);
    IMorpho(MORPHO).flashLoan(USDC, borrowAmount, data);
  }

  function onMorphoFlashLoan(uint256 assets, bytes calldata userData) external {
    uint8 callType = uint8(bytes1(userData[0]));
    uint8 useFxUSD = callType & 1;
    callType >>= 1;
    address tokenToUse = USDC;
    uint256 usdcToRepay = assets;
    // swap USDC to base if needed
    if (useFxUSD == 1) {
      assets = ICurveStableSwapNG(USDC_fxUSD_POOL).exchange(0, 1, assets, 0);
      tokenToUse = fxUSD;
    }
    // do rebalance or liquidate
    uint256 amountBase;
    address pool;
    if (callType == 0) {
      (pool, amountBase, assets) = _doRebalance(tokenToUse, assets, userData);
    } else if (callType == 1) {
      (pool, amountBase, assets) = _doLiquidate(tokenToUse, assets, userData);
    }
    // swap base to USDC
    uint256 usdcAmount = IERC20(USDC).balanceOf(address(this));
    {
      (, , address swapTarget, bytes memory swapData) = abi.decode(userData[1:], (address, uint256, address, bytes));
      IERC20(IPool(pool).collateralToken()).forceApprove(swapTarget, amountBase);
      (bool success, ) = swapTarget.call(swapData);
      _popupRevertReason(success);
    }
    usdcAmount = IERC20(USDC).balanceOf(address(this)) - usdcAmount;
    // swap rest fxUSD to USDC if needed
    if (usdcAmount < usdcToRepay && useFxUSD == 1 && assets > 0) {
      usdcAmount += ICurveStableSwapNG(USDC_fxUSD_POOL).exchange(1, 0, assets, 0);
    }
    if (usdcAmount < usdcToRepay) revert("cannot repay");
  }

  function _doRebalance(
    address tokenToUse,
    uint256 maxAmounts,
    bytes calldata userData
  ) internal returns (address, uint256, uint256) {
    (address pool, uint256 encoding, , ) = abi.decode(userData[1:], (address, uint256, address, bytes));
    uint256 numTicks = encoding % 65536;
    uint256 amountBase = 0;
    for (uint256 i = 0; i < numTicks; ++i) {
      encoding >>= 16;
      int256 tick = int256(encoding % 65536) - 32768;
      (uint256 tokenUsed, uint256 baseOut) = IFxUSDBasePool(fxBASE).rebalance(
        pool,
        int16(tick),
        tokenToUse,
        maxAmounts,
        0
      );
      amountBase += baseOut;
      maxAmounts -= tokenUsed;
    }
    return (pool, amountBase, maxAmounts);
  }

  function _doLiquidate(
    address tokenToUse,
    uint256 maxAmounts,
    bytes calldata userData
  ) internal returns (address, uint256, uint256) {
    (address pool, uint256 encoding, , ) = abi.decode(userData[1:], (address, uint256, address, bytes));
    uint256 amountBase = 0;
    while (true) {
      uint256 position = encoding % 4294967296;
      if (position == 0) break;
      (uint256 tokenUsed, uint256 baseOut) = IFxUSDBasePool(fxBASE).liquidate(
        pool,
        uint32(position),
        tokenToUse,
        maxAmounts,
        0
      );
      amountBase += baseOut;
      maxAmounts -= tokenUsed;
      encoding >>= 32;
    }
    return (pool, amountBase, maxAmounts);
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
