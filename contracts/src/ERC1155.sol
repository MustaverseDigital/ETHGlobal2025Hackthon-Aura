// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// OpenZeppelin imports
import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/cryptography/EIP712Upgradeable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "./interfaces/ILendingProtocol.sol";

/**
 * Upgradeable ERC-1155 Token with Permit functionality.
 * Uses UUPS Proxy pattern and allows setting approval for all via off-chain signature.
 */
contract MyERC1155 is Initializable, ERC1155Upgradeable,AccessControlUpgradeable,UUPSUpgradeable, EIP712Upgradeable
{
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");

    // Permit: Define the Permit structure's typehash and nonce mapping.
    // Structure: Permit(address owner, address operator, bool approved, uint256 nonce, uint256 deadline)
    bytes32 public constant PERMIT_TYPEHASH = keccak256("Permit(address owner,address operator,bool approved,uint256 nonce,uint256 deadline)");
    mapping(address => uint256) public nonces;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    /**
     * @notice Initializes the token.
     * @param _uri Metadata URI (can include "{id}" for dynamic replacement).
     * @param _admin Address that will be granted DEFAULT_ADMIN_ROLE, MINTER_ROLE, and UPGRADER_ROLE.
     */
    function initialize(string memory _uri, address _admin) public initializer {
        __ERC1155_init(_uri);
        __AccessControl_init();
        __UUPSUpgradeable_init();
        __EIP712_init("MyToken1155", "1");

        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _grantRole(MINTER_ROLE, _admin);
        _grantRole(UPGRADER_ROLE, _admin);
    }

    /**
     * @notice Mints a single token. Requires MINTER_ROLE.
     */
    function mintToken(
        address to, 
        uint256 id, 
        uint256 amount, 
        bytes memory data
    ) external onlyRole(MINTER_ROLE) {
        _mint(to, id, amount, data);
    }
    /**
     * @notice Burns a single tokens. Requires MINTER_ROLE.
     */
    function burnToken(
        address account,
        uint256 id,
        uint256 amount
    ) external onlyRole(MINTER_ROLE) {
        _burn(account, id, amount);
    }

    /**
     * @notice Burns multiple tokens. Requires MINTER_ROLE.
     */
    function burnBatchToken(
        address account,
        uint256[] memory ids,
        uint256[] memory amounts
    ) external onlyRole(MINTER_ROLE) {
        _burnBatch(account, ids, amounts);
    }

    /**
     * @notice Batch mints tokens. Requires MINTER_ROLE.
     */
    function mintBatchToken(
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) external onlyRole(MINTER_ROLE) {
        _mintBatch(to, ids, amounts, data);
    }

    /**
     * @notice Permit function: Sets approval for all via an off-chain signature.
     * @param owner The token owner's address.
     * @param operator The address to be approved.
     * @param approved Whether the operator is approved.
     * @param deadline The signature expiration timestamp.
     * @param v ECDSA v parameter.
     * @param r ECDSA r parameter.
     * @param s ECDSA s parameter.
     */
    function permit(
        address owner,
        address operator,
        bool approved,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external {
        require(block.timestamp <= deadline, "Permit: expired deadline");
        uint256 currentNonce = nonces[owner];
        bytes32 structHash = keccak256(abi.encode(
            PERMIT_TYPEHASH,
            owner,
            operator,
            approved,
            currentNonce,
            deadline
        ));
        bytes32 hash = _hashTypedDataV4(structHash);
        address signer = ECDSA.recover(hash, v, r, s);
        require(signer == owner, "Permit: invalid signature");
        nonces[owner] = currentNonce + 1;
        _setApprovalForAll(owner, operator, approved);
    }

    /**
     * @notice Burn function: Allows a token owner or an approved operator to burn tokens.
     * @param account The account from which tokens will be burned.
     * @param id The token id.
     * @param amount The amount of tokens to burn.
     */
    function burn(address account, uint256 id, uint256 amount) external {
        require(
            account == _msgSender() || isApprovedForAll(account, _msgSender()),
            "MyToken1155: caller is not owner nor approved"
        );
        _burn(account, id, amount);
    }

    /**
     * @notice Override supportsInterface for multiple inheritance.
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC1155Upgradeable, AccessControlUpgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    /**
     * @notice UUPS upgrade authorization: Only addresses with UPGRADER_ROLE can upgrade.
     */
    function _authorizeUpgrade(address newImplementation)
        internal
        override
        onlyRole(UPGRADER_ROLE)
    {}
}
