// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts (last updated v5.1.0) (token/ERC1155/IERC1155.sol)

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";

/**
 * @dev Required interface of an ERC-1155 compliant contract, as defined in the
 * https://eips.ethereum.org/EIPS/eip-1155[ERC].
 */
interface IMyERC1155 is IERC1155 {

    function mintToken(
        address to, 
        uint256 id, 
        uint256 amount, 
        bytes memory data
    ) external;

    function burnToken(
        address account,
        uint256 id,
        uint256 amount
    ) external;
}