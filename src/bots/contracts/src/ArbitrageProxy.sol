// SPDX-License-Identifier: MIT

pragma solidity ^0.8.26;

contract ArbitrageProxy {
  /**********
   * Errors *
   **********/

  error ErrorNotManager();

  error ErrorNotOperator();

  /*************
   * Constants *
   *************/

  /// @dev Storage slot with the address of the current implementation.
  /// This is the keccak-256 hash of "eip1967.proxy.implementation" subtracted by 1, and is
  /// validated in the constructor.
  bytes32 private constant IMPLEMENTATION_SLOT = 0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc;

  /*************
   * Variables *
   *************/

  /// @dev The list of managers.
  mapping(address => bool) private managers;

  /// @dev The list of operators.
  mapping(address => bool) private operators;

  /*************
   * Modifiers *
   *************/

  modifier onlyManager() {
    if (!managers[msg.sender]) revert ErrorNotManager();
    _;
  }

  /***************
   * Constructor *
   ***************/

  constructor(address[] memory _managers, address[] memory _operators) {
    for (uint256 i = 0; i < _managers.length; i++) {
      managers[_managers[i]] = true;
    }
    for (uint256 i = 0; i < _operators.length; i++) {
      operators[_operators[i]] = true;
    }

    // solhint-disable-next-line no-inline-assembly
    assembly {
      sstore(IMPLEMENTATION_SLOT, 1)
    }
  }

  /****************************
   * Public Mutated Functions *
   ****************************/

  // solhint-disable-next-line no-empty-blocks
  receive() external payable {}

  // solhint-disable-next-line no-complex-fallback
  fallback() external payable {
    address _implementation;
    uint256 _reset = 0;

    // solhint-disable-next-line no-inline-assembly
    assembly {
      _implementation := sload(IMPLEMENTATION_SLOT)
    }
    if (_implementation == address(1)) {
      if (!operators[msg.sender]) revert ErrorNotOperator();
      assembly {
        _implementation := sload(shl(224, shr(224, calldataload(0))))
        sstore(IMPLEMENTATION_SLOT, _implementation)
        _reset := 1
      }
    }

    // delegate to implementation
    assembly {
      // Copy msg.data. We take full control of memory in this inline assembly
      // block because it will not return to Solidity code. We overwrite the
      // Solidity scratch pad at memory position 0.
      calldatacopy(0, 0, calldatasize())

      // Call the implementation.
      // out and outsize are 0 because we don't know the size yet.
      let result := delegatecall(gas(), _implementation, 0, calldatasize(), 0, 0)

      // Copy the returned data.
      returndatacopy(0, 0, returndatasize())

      if eq(_reset, 1) {
        sstore(IMPLEMENTATION_SLOT, 1)
      }

      switch result
      // delegatecall returns 0 on error.
      case 0 {
        revert(0, returndatasize())
      }
      default {
        return(0, returndatasize())
      }
    }
  }

  /************************
   * Restricted Functions *
   ************************/

  /// @notice Update the status for a list of manager.
  /// @param _managers The address list of managers to update.
  /// @param _status The status to update.
  function updateManagers(address[] memory _managers, bool _status) external onlyManager {
    for (uint256 i = 0; i < _managers.length; ++i) {
      managers[_managers[i]] = _status;
    }
  }

  /// @notice Update the status for a list of operators.
  /// @param _operators The address list of operators to update.
  /// @param _status The status to update.
  function updateOperators(address[] memory _operators, bool _status) external onlyManager {
    for (uint256 i = 0; i < _operators.length; ++i) {
      operators[_operators[i]] = _status;
    }
  }

  /// @notice Update the implementation for the given function signature.
  /// @param _sig The function signature to update.
  /// @param _impl The contract implementation to update.
  function updateImpl(bytes4 _sig, address _impl) external onlyManager {
    _setImplementation(_sig, _impl);
  }

  function rescue(address to, uint256 value, bytes memory data) external payable onlyManager returns (bool success) {
    // solhint-disable-next-line no-inline-assembly
    assembly {
      success := call(gas(), to, value, add(data, 0x20), mload(data), 0, 0)
    }
  }

  /// @dev Internal function to set implementation for the given function signature.
  /// @param _sig The function signature to update.
  /// @param _impl The contract implementation to update.
  function _setImplementation(bytes4 _sig, address _impl) internal {
    uint32 slot = uint32(_sig);
    assembly {
      sstore(shl(224, slot), _impl)
    }
  }

  /**********************
   * Internal Functions *
   **********************/

  /// @dev Internal function to get implementation for the given function signature.
  /// @param _sig The function signature to query.
  /// @return impl The current implementation for the function signature.
  function _getImplementation(bytes4 _sig) internal view returns (address impl) {
    assembly {
      let slot := shl(224, _sig)
      impl := sload(slot)
    }
  }
}
