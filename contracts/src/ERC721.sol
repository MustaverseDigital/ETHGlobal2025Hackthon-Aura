// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/cryptography/EIP712Upgradeable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

/**
 * ERC721PermitUpgradeable
 *
 * An upgradeable ERC721 contract that includes EIP-4494 Permit functionality,
 * allowing token owners to authorize spenders for a specific tokenId via off-chain signatures.
 * It also supports UUPS upgrades and access control.
 */
contract MyERC721 is Initializable, ERC721Upgradeable, EIP712Upgradeable, UUPSUpgradeable, AccessControlUpgradeable {
    // Role for upgrade authorization
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");
    // Role for minting tokens
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    // Mapping to store nonces for each tokenId for permit functionality (per EIP-4494)
    mapping(uint256 => uint256) private _nonces;

    // URI for the ERC721 metadata
    mapping(uint256 => string) private _tokenURI;

    // Permit struct typehash
    // keccak256("Permit(address spender,uint256 tokenId,uint256 nonce,uint256 deadline)")
    bytes32 private constant _PERMIT_TYPEHASH = keccak256("Permit(address spender,uint256 tokenId,uint256 nonce,uint256 deadline)");

    // Counter for auto-incrementing token IDs
    uint256 private _tokenIdCounter;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    /**
     * @dev Initializes the contract with the given name and symbol.
     * @param name_ The name of the token.
     * @param symbol_ The token symbol.
     */
    function initialize(string memory name_, string memory symbol_) public initializer {
        __ERC721_init(name_, symbol_);
        __EIP712_init(name_, "1"); // Use the token name and version "1" for the domain separator
        __AccessControl_init();
        __UUPSUpgradeable_init();

        // Set up initial roles: deployer is granted default admin, upgrader, and minter roles.
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(UPGRADER_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
    }

    /**
     * @dev Returns the nonce for the specified tokenId.
     */
    function nonce(uint256 tokenId) public view returns (uint256) {
        return _nonces[tokenId];
    }

    /**
     * @dev Permit function allowing token owner to approve a spender via off-chain signature.
     * @param spender The address to be approved.
     * @param tokenId The token ID for which approval is granted.
     * @param deadline The timestamp by which the signature must be submitted.
     * @param v The recovery byte of the signature.
     * @param r Half of the ECDSA signature pair.
     * @param s Half of the ECDSA signature pair.
     */
    function permit(
        address spender,
        uint256 tokenId,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) public {
        require(block.timestamp <= deadline, "Permit: expired deadline");

        address owner = ownerOf(tokenId);
        uint256 currentNonce = _nonces[tokenId];

        bytes32 structHash = keccak256(abi.encode(
            _PERMIT_TYPEHASH,
            spender,
            tokenId,
            currentNonce,
            deadline
        ));

        bytes32 hash = _hashTypedDataV4(structHash);
        address signer = ECDSA.recover(hash, v, r, s);
        require(signer == owner, "Permit: invalid signature");

        _nonces[tokenId] = currentNonce + 1;
        approve(spender, tokenId);
    }

    /**
     * @dev Auto-incrementing mint function.
     *
     * Mints a new token using the internal _tokenIdCounter as the token ID,
     * and then increments the counter. Only accounts with the MINTER_ROLE can call this function.
     * @param to The address that will receive the minted token.
     */
    function safeMint(address to) public onlyRole(MINTER_ROLE) {
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;  // Auto-increment the token ID counter
        _safeMint(to, tokenId);
    }

    /**
     * @dev UUPS upgrade authorization function.
     * Only addresses with the UPGRADER_ROLE can authorize an upgrade.
     */
    function _authorizeUpgrade(address newImplementation)
        internal
        override
        onlyRole(UPGRADER_ROLE)
    {}

    /**
     * @dev Override supportsInterface to include interfaces from inherited contracts.
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721Upgradeable, AccessControlUpgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    /**
     * @dev Override tokenURI to return the stored token URI.
     */
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        return _tokenURI[tokenId];
    }

    /**
     * @dev Sets the token URI for all tokens.
     * Only callable by the DEFAULT_ADMIN_ROLE.
     * @param tokenURI_ The new token URI.
     */
    function setTokenURI(uint256 tokenId, string memory tokenURI_) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _tokenURI[tokenId] = tokenURI_;
    }
}
