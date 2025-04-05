// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// OpenZeppelin imports
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
// For ERC20 Permit (EIP-2612)
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IMyERC1155.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/cryptography/EIP712Upgradeable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "./interfaces/IMyERC1155.sol";



// 1155 metadata
// erc721
// 到期期限
// apy
// 借多少錢
// 哪天借
// 哪天還

/// @dev Minimal interface for ERC721 Permit (EIP-4494)
interface IERC721Permit {
    function permit(
        address spender,
        uint256 tokenId,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external;
}

/// @dev Custom interface for ERC1155 Permit (non-standard)
interface IERC1155Permit {
    function permit(
        address owner,
        address operator,
        uint256 tokenId,
        uint256 amount,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external;
}

/// @title DerivativeLoan
/// @notice A simplified derivative loan contract that allows borrowers to deposit a basket of collateral (ERC20, ERC721, ERC1155)
/// as security for a loan in accepted stablecoins. Only whitelisted lenders can fund loans.
/// When a loan is funded, an ERC1155 loan note is minted to the lender, which can later be redeemed to withdraw the
/// principal and interest.
contract DerivativeLoan is 
        Initializable,
        ERC1155Upgradeable,
        AccessControlUpgradeable,
        UUPSUpgradeable,
        EIP712Upgradeable
    {
    using SafeERC20 for IERC20;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");

    /// @dev Enum to represent asset types.
    enum AssetType { ERC20, ERC721, ERC1155 }

    /// @dev Struct representing a single collateral asset.
    struct CollateralAsset {
        AssetType assetType;
        address assetAddress;
        uint256 tokenId; // For ERC721 and ERC1155; ignored for ERC20.
        uint256 amount;  // For ERC20 and ERC1155; for ERC721, always 1.
    }

    /// @dev Structure representing permit data for collateral assets.
    /// For ERC20: 'value' represents the amount; for ERC721: 'value' is ignored; for ERC1155: 'value' represents the amount.
    struct PermitData {
        AssetType assetType;
        uint256 value;
        uint256 deadline;
        uint8 v;
        bytes32 r;
        bytes32 s;
    }

    /// @dev Enum to represent loan status.
    enum LoanStatus { Requested, Funded, Repaid, Defaulted }

    /// @dev Struct for loan details.
    struct Loan {
        uint256 loanId;
        address borrower;
        address stablecoin; // The stablecoin used for the loan.
        uint256 loanAmount; // Principal amount.
        uint256 interestRate; // e.g., percentage (for simplicity)
        uint256 duration;   // Loan duration in seconds.
        uint256 startTime;  // Time when the loan is funded.
        LoanStatus status;
        CollateralAsset[] collateralAssets; // Basket of collateral.
        address lender; // The lender who funds the loan.
        uint256 repaymentAmount; // Total amount repaid (principal + interest)
        bool withdrawn; // Whether lender has redeemed funds.
        uint256 inquiryDeadline; // Timestamp until which lender offers are accepted.
    }

    uint256 public nextLoanId;
    mapping(uint256 => Loan) public loans;

    // Mapping of accepted stablecoin addresses.
    mapping(address => bool) public acceptedStablecoins;
    // Mapping for lender whitelist. Every lender must be whitelisted.
    mapping(address => bool) public lenderWhitelist;

    // URI for the ERC1155 Loan Note contract.
    mapping(uint256 => string) private _tokenURIs;

    // // Instance of the ERC1155 Loan Note contract.
    // IMyToken1155 public loanNote;

    // Events
    event LoanRequested(uint256 indexed loanId, address indexed borrower);
    event LoanFunded(uint256 indexed loanId, address indexed lender);
    event LoanRepaid(uint256 indexed loanId);
    event LoanLiquidated(uint256 indexed loanId);
    event LoanNoteRedeemed(uint256 indexed loanId, address indexed redeemer, uint256 amount);
    event LoanCancelled(uint256 indexed loanId);

    /// @dev Modifier to restrict functions to whitelisted lenders.
    modifier onlyWhitelistedLender() {
        require(lenderWhitelist[msg.sender], "Not a whitelisted lender");
        _;
    }

    modifier onlyOwner() {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Caller is not the owner");
        _;
    }

    // Owner functions to manage accepted stablecoins and lender whitelist.
    function setAcceptedStablecoin(address token, bool accepted) external onlyOwner {
        acceptedStablecoins[token] = accepted;
    }

    function setLenderWhitelist(address lender, bool whitelisted) external onlyOwner {
        lenderWhitelist[lender] = whitelisted;
    }

    constructor() {
        _disableInitializers();
    }

    function initialize(string memory _uri, address _admin) public initializer {
        __ERC1155_init(_uri);
        __AccessControl_init();
        __UUPSUpgradeable_init();
        __EIP712_init("MyToken1155", "1");

        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _grantRole(MINTER_ROLE, _admin);
        _grantRole(UPGRADER_ROLE, _admin);
    }

    // /**
    // * @notice Sets the address of the pre-deployed ERC1155LoanNote contract.
    // * @param _loanNote The address of the ERC1155LoanNote contract.
    // */
    // function setLoanNoteAddress(address _loanNote) external onlyOwner {
    //     loanNote = IMyToken1155(_loanNote);
    // }

    /// @notice Borrower initiates a loan request by depositing collateral without using permit.
    /// @param stablecoin The address of the stablecoin to be used.
    /// @param loanAmount The principal amount requested.
    /// @param interestRate The interest rate (percentage).
    /// @param duration The loan duration in seconds.
    /// @param inquiryDuration The inquiry period duration in seconds.
    /// @param collateralAssets An array of collateral assets provided.
    function requestLoan(
        address stablecoin,
        uint256 loanAmount,
        uint256 interestRate,
        uint256 duration,
        uint256 inquiryDuration,
        CollateralAsset[] calldata collateralAssets
    ) external {
        require(acceptedStablecoins[stablecoin], "Stablecoin not accepted");
        require(loanAmount > 0, "Loan amount must be > 0");

        // Transfer collateral assets from borrower to contract.
        for (uint i = 0; i < collateralAssets.length; i++) {
            CollateralAsset calldata asset = collateralAssets[i];
            if (asset.assetType == AssetType.ERC20) {
                IERC20(asset.assetAddress).safeTransferFrom(msg.sender, address(this), asset.amount);
            } else if (asset.assetType == AssetType.ERC721) {
                IERC721(asset.assetAddress).transferFrom(msg.sender, address(this), asset.tokenId);
            } else if (asset.assetType == AssetType.ERC1155) {
                IERC1155(asset.assetAddress).safeTransferFrom(msg.sender, address(this), asset.tokenId, asset.amount, "");
            }
        }

        Loan storage loan = loans[nextLoanId];
        loan.loanId = nextLoanId;
        loan.borrower = msg.sender;
        loan.stablecoin = stablecoin;
        loan.loanAmount = loanAmount;
        loan.interestRate = interestRate;
        loan.duration = duration;
        loan.status = LoanStatus.Requested;
        loan.inquiryDeadline = block.timestamp + inquiryDuration;
        for (uint i = 0; i < collateralAssets.length; i++) {
            loan.collateralAssets.push(collateralAssets[i]);
        }

        emit LoanRequested(nextLoanId, msg.sender);
        nextLoanId++;
    }

    /// @notice Borrower initiates a loan request by depositing collateral using permit where available.
    /// For ERC20, ERC721, and ERC1155 (if supported) collateral, permit is used to authorize the transfer.
    /// @param stablecoin The stablecoin address.
    /// @param loanAmount The loan principal amount.
    /// @param interestRate The interest rate (percentage).
    /// @param duration The loan duration.
    /// @param inquiryDuration The inquiry period duration in seconds.
    /// @param collateralAssets An array of collateral assets provided.
    /// @param permits An array of permit data corresponding to each collateral asset.
    /// The length of `collateralAssets` must equal the length of `permits`.
    function requestLoanWithPermit(
        address stablecoin,
        uint256 loanAmount,
        uint256 interestRate,
        uint256 duration,
        uint256 inquiryDuration,
        CollateralAsset[] calldata collateralAssets,
        PermitData[] calldata permits
    ) external {
        require(collateralAssets.length == permits.length, "Array length mismatch");
        require(acceptedStablecoins[stablecoin], "Stablecoin not accepted");
        require(loanAmount > 0, "Loan amount must be > 0");

        // For each collateral asset, if permit data is provided and asset supports permit, call permit first.
        for (uint i = 0; i < collateralAssets.length; i++) {
            CollateralAsset calldata asset = collateralAssets[i];
            PermitData calldata pd = permits[i];
            require(asset.assetType == pd.assetType, "Asset type mismatch in permit data");

            if (asset.assetType == AssetType.ERC20) {
                // ERC20 permit (EIP-2612)
                IERC20Permit(asset.assetAddress).permit(
                    msg.sender,
                    address(this),
                    pd.value,
                    pd.deadline,
                    pd.v,
                    pd.r,
                    pd.s
                );
            } else if (asset.assetType == AssetType.ERC721) {
                // ERC721 permit (EIP-4494)
                IERC721Permit(asset.assetAddress).permit(
                    address(this),
                    asset.tokenId,
                    pd.deadline,
                    pd.v,
                    pd.r,
                    pd.s
                );
            } else if (asset.assetType == AssetType.ERC1155) {
                // ERC1155 permit (custom implementation)
                IERC1155Permit(asset.assetAddress).permit(
                    msg.sender,
                    address(this),
                    asset.tokenId,
                    asset.amount,
                    pd.deadline,
                    pd.v,
                    pd.r,
                    pd.s
                );
            }
            // After permit (or if no permit), transfer collateral asset from borrower to contract.
            if (asset.assetType == AssetType.ERC20) {
                IERC20(asset.assetAddress).safeTransferFrom(msg.sender, address(this), asset.amount);
            } else if (asset.assetType == AssetType.ERC721) {
                IERC721(asset.assetAddress).transferFrom(msg.sender, address(this), asset.tokenId);
            } else if (asset.assetType == AssetType.ERC1155) {
                IERC1155(asset.assetAddress).safeTransferFrom(msg.sender, address(this), asset.tokenId, asset.amount, "");
            }
        }

        // Create loan record.
        Loan storage loan = loans[nextLoanId];
        loan.loanId = nextLoanId;
        loan.borrower = msg.sender;
        loan.stablecoin = stablecoin;
        loan.loanAmount = loanAmount;
        loan.interestRate = interestRate;
        loan.duration = duration;
        loan.status = LoanStatus.Requested;
        loan.inquiryDeadline = block.timestamp + inquiryDuration;
        for (uint i = 0; i < collateralAssets.length; i++) {
            loan.collateralAssets.push(collateralAssets[i]);
        }

        emit LoanRequested(nextLoanId, msg.sender);
        nextLoanId++;
    }

    /// @notice Allows the borrower to cancel the loan request and reclaim collateral if no lender funds the loan within the inquiry period.
    /// @param loanId The ID of the loan to cancel.
    function cancelLoanRequest(uint256 loanId) external {
        Loan storage loan = loans[loanId];
        require(msg.sender == loan.borrower, "Not the borrower");
        require(loan.status == LoanStatus.Requested, "Loan cannot be cancelled");
        require(block.timestamp > loan.inquiryDeadline, "Inquiry period not expired");

        // Return collateral to borrower.
        for (uint i = 0; i < loan.collateralAssets.length; i++) {
            CollateralAsset storage asset = loan.collateralAssets[i];
            if (asset.assetType == AssetType.ERC20) {
                IERC20(asset.assetAddress).safeTransfer(loan.borrower, asset.amount);
            } else if (asset.assetType == AssetType.ERC721) {
                IERC721(asset.assetAddress).transferFrom(address(this), loan.borrower, asset.tokenId);
            } else if (asset.assetType == AssetType.ERC1155) {
                IERC1155(asset.assetAddress).safeTransferFrom(address(this), loan.borrower, asset.tokenId, asset.amount, "");
            }
        }
        // Optionally, update the loan status to a Cancelled state.
        loan.status = LoanStatus.Defaulted; // 或使用另一個狀態如 Cancelled
        emit LoanCancelled(loanId);
    }

    /// @notice A whitelisted lender funds the requested loan.
    /// The lender transfers the stablecoin loan amount to the contract,
    /// which is then forwarded to the borrower.
    /// An ERC1155 loan note is minted to the lender.
    /// @param loanId The ID of the loan to fund.
    function fundLoan(uint256 loanId) external onlyWhitelistedLender {
        Loan storage loan = loans[loanId];
        require(loan.status == LoanStatus.Requested, "Loan not available for funding");

        // Transfer stablecoin from lender to contract.
        IERC20(loan.stablecoin).safeTransferFrom(msg.sender, address(this), loan.loanAmount);

        // Forward stablecoin to borrower.
        IERC20(loan.stablecoin).safeTransfer(loan.borrower, loan.loanAmount);
        loan.lender = msg.sender;
        loan.startTime = block.timestamp;
        loan.status = LoanStatus.Funded;
        emit LoanFunded(loanId, msg.sender);

        // Mint 1 unit of ERC1155 loan note for this loan to the lender.
        _mint(msg.sender, loanId, loan.loanAmount, "");
    }

    /// @notice Borrower repays the loan (principal + interest).
    /// The repayment amount is stored in the loan for later withdrawal by the lender.
    /// Collateral is returned to the borrower.
    /// @param loanId The ID of the loan to repay.
    function repayLoan(uint256 loanId) external {
        Loan storage loan = loans[loanId];
        require(msg.sender == loan.borrower, "Not the borrower");
        require(loan.status == LoanStatus.Funded, "Loan not funded");

        // Simple interest calculation.
        uint256 interest = loan.loanAmount * loan.interestRate / 100;
        uint256 totalRepayment = loan.loanAmount + interest;
        // Borrower transfers the repayment to the contract.
        IERC20(loan.stablecoin).safeTransferFrom(msg.sender, address(this), totalRepayment);

        loan.repaymentAmount = totalRepayment;
        loan.status = LoanStatus.Repaid;
        emit LoanRepaid(loanId);

        // Return collateral to borrower.
        for (uint i = 0; i < loan.collateralAssets.length; i++) {
            CollateralAsset storage asset = loan.collateralAssets[i];
            if (asset.assetType == AssetType.ERC20) {
                IERC20(asset.assetAddress).safeTransfer(loan.borrower, asset.amount);
            } else if (asset.assetType == AssetType.ERC721) {
                IERC721(asset.assetAddress).transferFrom(address(this), loan.borrower, asset.tokenId);
            } else if (asset.assetType == AssetType.ERC1155) {
                IERC1155(asset.assetAddress).safeTransferFrom(address(this), loan.borrower, asset.tokenId, asset.amount, "");
            }
        }
    }

    /// @notice Lender redeems the ERC1155 loan note to withdraw the repaid principal and interest.
    /// The lender must burn the loan note token to claim the funds.
    /// @param loanId The ID of the loan.
    function redeemLoanNote(uint256 loanId, uint256 amount) external {
        Loan storage loan = loans[loanId];
        require(loan.status == LoanStatus.Repaid, "Loan not repaid");
        require(msg.sender == loan.lender, "Not the lender");
        require(!loan.withdrawn, "Already withdrawn");

        // Burn the loan note token.
        _burn(msg.sender, loanId, amount);

        // Transfer the repayment amount to the lender.
        IERC20(loan.stablecoin).safeTransfer(msg.sender, amount);
        loan.withdrawn = true;
        emit LoanNoteRedeemed(loanId, msg.sender, amount);
    }

    /// @notice If the borrower defaults (after duration + 3 days), the lender can liquidate the loan.
    /// The collateral is transferred to the lender.
    /// @param loanId The ID of the loan to liquidate.
    function liquidateLoan(uint256 loanId) external {
        Loan storage loan = loans[loanId];
        require(loan.status == LoanStatus.Funded, "Loan not active");
        require(block.timestamp > loan.startTime + loan.duration + 3 days, "Loan not defaulted yet");
        require(msg.sender == loan.lender, "Not the lender");

        loan.status = LoanStatus.Defaulted;
        emit LoanLiquidated(loanId);

        IERC20(loan.stablecoin).safeTransferFrom(msg.sender, address(this), loan.repaymentAmount);

        // Transfer collateral to lender.
        for (uint i = 0; i < loan.collateralAssets.length; i++) {
            CollateralAsset storage asset = loan.collateralAssets[i];
            if (asset.assetType == AssetType.ERC20) {
                IERC20(asset.assetAddress).safeTransfer(loan.lender, asset.amount);
            } else if (asset.assetType == AssetType.ERC721) {
                IERC721(asset.assetAddress).transferFrom(address(this), loan.lender, asset.tokenId);
            } else if (asset.assetType == AssetType.ERC1155) {
                IERC1155(asset.assetAddress).safeTransferFrom(address(this), loan.lender, asset.tokenId, asset.amount, "");
            }
        }
    }

    // get loan details
    function getLoanDetails(uint256 loanId) external view returns (Loan memory) {
        return loans[loanId];
    }

    /**
     * @dev Returns the metadata URI for a given token ID.
     */
    function tokenURI(uint256 _tokenId) public view returns (string memory) {
        return _tokenURIs[_tokenId];
    }

    /**
     * @dev Sets the metadata URI for a given token ID.
     * Only callable by the contract owner.
     */
    function setTokenURI(uint256 _tokenId, string memory _uri) external onlyOwner {
        _tokenURIs[_tokenId] = _uri;    
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
