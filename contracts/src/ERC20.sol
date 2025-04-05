// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract MyERC20 is Initializable, ERC20Upgradeable, UUPSUpgradeable, AccessControlUpgradeable {
    // Define an upgrade role for controlling contract upgrades.
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");

    // Initialization function (replaces the traditional constructor).
    function initialize(uint256 initialSupply) public initializer {
        __ERC20_init("USD Coin", "USDC");
        __AccessControl_init();
        __UUPSUpgradeable_init();

        // Set the admin and upgrader roles.
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(UPGRADER_ROLE, msg.sender);

        // Mint the initial supply to the deployer.
        _mint(msg.sender, initialSupply);
    }

    // UUPS upgrade authorization function: only addresses with UPGRADER_ROLE can authorize an upgrade.
    function _authorizeUpgrade(address newImplementation)
        internal
        override
        onlyRole(UPGRADER_ROLE)
    {}

    // Override decimals to return 6, consistent with USDC.
    function decimals() public pure override returns (uint8) {
        return 6;
    }
}
