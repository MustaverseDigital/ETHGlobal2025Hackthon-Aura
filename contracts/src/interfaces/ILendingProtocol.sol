/// @dev Minimal interface for ERC721 Permit (EIP-4494)
interface ILendingProtocol {

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
    


    function setAcceptedStablecoin(address token, bool accepted) external;
    function setLenderWhitelist(address lender, bool whitelisted) external;
    function requestLoan(
        address stablecoin,
        uint256 loanAmount,
        uint256 interestRate,
        uint256 duration,
        uint256 inquiryDuration,
        CollateralAsset[] calldata collateralAssets
    ) external;
    function requestLoanWithPermit(
        address stablecoin,
        uint256 loanAmount,
        uint256 interestRate,
        uint256 duration,
        uint256 inquiryDuration,
        CollateralAsset[] calldata collateralAssets,
        PermitData[] calldata permits
    ) external;
    function cancelLoanRequest(uint256 loanId) external;
    function fundLoan(uint256 loanId) external;
    function fundLoanWithPermit(
        uint256 loanId,
        PermitData calldata permit
    ) external;
    function repayLoan(uint256 loanId) external;
    function redeemLoanNote(uint256 loanId, uint256 amount) external;
    function liquidateLoan(uint256 loanId) external;
    function liquidateLoanWithPermit(
        uint256 loanId,
        PermitData calldata permit
    ) external;
    function getLoanDetails(uint256 loanId) external view returns (Loan memory);
    function tokenURI(uint256 _tokenId) external view returns (string memory);
    function setTokenURI(uint256 _tokenId, string memory _uri) external;
    function supportsInterface(bytes4 interfaceId) external view returns (bool);
}