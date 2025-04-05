// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title ILendingProtocol
/// @notice Interface for a lending protocol that allows borrowers to deposit a basket of collateral
/// (ERC20, ERC721, ERC1155 tokens) as security for a loan in accepted stablecoins. Only whitelisted lenders
/// can fund loans. When a loan is funded, an ERC1155 loan note is minted to the lender, which can later be
/// redeemed to withdraw the principal and interest.
interface ILendingProtocol {

    /// @dev Enum representing the type of asset used as collateral.
    /// - ERC20: Fungible token
    /// - ERC721: Non-fungible token (single unique item)
    /// - ERC1155: Multi-token (can represent fungible or non-fungible tokens)
    enum AssetType { ERC20, ERC721, ERC1155 }

    /// @dev Structure representing a single collateral asset.
    /// @param assetType The type of asset (ERC20, ERC721, or ERC1155).
    /// @param assetAddress The contract address of the collateral asset.
    /// @param tokenId For ERC721 and ERC1155 assets, this is the token ID (ignored for ERC20).
    /// @param amount For ERC20 and ERC1155 assets, this represents the quantity;
    ///               for ERC721, this is typically 1.
    struct CollateralAsset {
        AssetType assetType;
        address assetAddress;
        uint256 tokenId;
        uint256 amount;
    }

    /// @dev Structure representing permit data for collateral assets.
    /// For ERC20: 'value' represents the amount to be permitted.
    /// For ERC721: 'value' is ignored.
    /// For ERC1155: 'value' represents the amount to be permitted.
    /// @param assetType The type of asset to which this permit applies.
    /// @param value The amount approved (for ERC20 or ERC1155).
    /// @param deadline The UNIX timestamp after which the permit expires.
    /// @param v The 'v' parameter of the ECDSA signature.
    /// @param r The 'r' parameter of the ECDSA signature.
    /// @param s The 's' parameter of the ECDSA signature.
    struct PermitData {
        AssetType assetType;
        uint256 value;
        uint256 deadline;
        uint8 v;
        bytes32 r;
        bytes32 s;
    }

    /// @dev Enum representing the status of a loan.
    /// - Requested: Loan has been requested by the borrower.
    /// - Funded: Loan has been funded by a lender.
    /// - Repaid: Borrower has repaid the loan.
    /// - Defaulted: Borrower defaulted on the loan.
    enum LoanStatus { Requested, Funded, Repaid, Defaulted }

    /// @dev Structure containing the details of a loan.
    /// @param loanId Unique identifier for the loan.
    /// @param borrower Address of the borrower.
    /// @param stablecoin The contract address of the stablecoin used for the loan.
    /// @param loanAmount The principal amount of the loan.
    /// @param interestRate The interest rate (expressed as a percentage for simplicity).
    /// @param duration The duration of the loan in seconds.
    /// @param startTime The UNIX timestamp when the loan was funded.
    /// @param status The current status of the loan (from LoanStatus).
    /// @param collateralAssets An array of collateral assets provided for the loan.
    /// @param lender Address of the lender who funds the loan.
    /// @param repaymentAmount The total amount repaid (principal plus interest).
    /// @param withdrawn Indicates whether the lender has redeemed the repaid funds.
    /// @param inquiryDeadline The UNIX timestamp until which lender offers are accepted.
    struct Loan {
        uint256 loanId;
        address borrower;
        address stablecoin;
        uint256 loanAmount;
        uint256 interestRate;
        uint256 duration;
        uint256 startTime;
        LoanStatus status;
        CollateralAsset[] collateralAssets;
        address lender;
        uint256 repaymentAmount;
        bool withdrawn;
        uint256 inquiryDeadline;
    }

    /// @notice Sets an ERC20 token as an accepted stablecoin for loans.
    /// @param token The stablecoin contract address.
    /// @param accepted True if the stablecoin is accepted; false otherwise.
    function setAcceptedStablecoin(address token, bool accepted) external;

    /// @notice Adds or removes a lender from the whitelist.
    /// @param lender The address of the lender.
    /// @param whitelisted True to whitelist the lender; false to remove.
    function setLenderWhitelist(address lender, bool whitelisted) external;

    /// @notice Submits a loan request by depositing collateral (without using permit).
    /// @param stablecoin The stablecoin address to be used for the loan.
    /// @param loanAmount The principal amount of the loan.
    /// @param interestRate The interest rate (percentage).
    /// @param duration The duration of the loan in seconds.
    /// @param inquiryDuration The duration of the inquiry period in seconds.
    /// @param collateralAssets An array of collateral assets provided by the borrower.
    function requestLoan(
        address stablecoin,
        uint256 loanAmount,
        uint256 interestRate,
        uint256 duration,
        uint256 inquiryDuration,
        CollateralAsset[] calldata collateralAssets
    ) external;

    /// @notice Submits a loan request using permit data for collateral transfers.
    /// @param stablecoin The stablecoin address to be used for the loan.
    /// @param loanAmount The principal amount of the loan.
    /// @param interestRate The interest rate (percentage).
    /// @param duration The duration of the loan in seconds.
    /// @param inquiryDuration The duration of the inquiry period in seconds.
    /// @param collateralAssets An array of collateral assets provided by the borrower.
    /// @param permits An array of permit data corresponding to each collateral asset.
    ///                The length of `collateralAssets` must equal the length of `permits`.
    function requestLoanWithPermit(
        address stablecoin,
        uint256 loanAmount,
        uint256 interestRate,
        uint256 duration,
        uint256 inquiryDuration,
        CollateralAsset[] calldata collateralAssets,
        PermitData[] calldata permits
    ) external;

    /// @notice Cancels a loan request and returns the collateral to the borrower if no lender has funded the loan.
    /// @param loanId The ID of the loan to cancel.
    function cancelLoanRequest(uint256 loanId) external;

    /// @notice Funds a loan request. The lender transfers the stablecoin loan amount to the contract,
    /// which is then forwarded to the borrower, and an ERC1155 loan note is minted to the lender.
    /// @param loanId The ID of the loan to fund.
    function fundLoan(uint256 loanId) external;

    /// @notice Funds a loan request using permit for stablecoin transfer.
    /// @param loanId The ID of the loan to fund.
    /// @param permit One set of permit data (ERC20Permit) for the stablecoin transfer.
    function fundLoanWithPermit(
        uint256 loanId,
        PermitData calldata permit
    ) external;

    /// @notice Repays the loan (principal + interest). The repayment is stored for later withdrawal by the lender,
    /// and the collateral is returned to the borrower.
    /// @param loanId The ID of the loan to repay.
    function repayLoan(uint256 loanId) external;

    /// @notice Redeems the ERC1155 loan note to withdraw the repaid funds.
    /// The lender must burn the specified amount of loan notes to claim the corresponding funds.
    /// @param loanId The ID of the loan.
    /// @param amount The amount of loan notes to burn (usually corresponding to the repaid amount).
    function redeemLoanNote(uint256 loanId, uint256 amount) external;

    /// @notice Liquidates a loan if the borrower defaults (e.g., does not repay by the deadline).
    /// The collateral is transferred to the lender.
    /// @param loanId The ID of the loan to liquidate.
    function liquidateLoan(uint256 loanId) external;

    /// @notice Liquidates a loan using permit for stablecoin transfer if the borrower defaults.
    /// @param loanId The ID of the loan to liquidate.
    /// @param permit One set of permit data (ERC20Permit) for the stablecoin transfer.
    function liquidateLoanWithPermit(
        uint256 loanId,
        PermitData calldata permit
    ) external;

    /// @notice Retrieves the details of a loan.
    /// @param loanId The ID of the loan.
    /// @return The Loan struct containing all details of the loan.
    function getLoanDetails(uint256 loanId) external view returns (Loan memory);

    /// @notice Retrieves the metadata URI for a given token ID.
    /// @param _tokenId The token ID.
    /// @return The metadata URI as a string.
    function tokenURI(uint256 _tokenId) external view returns (string memory);

    /// @notice Sets the metadata URI for a given token ID. Only callable by the contract owner.
    /// @param _tokenId The token ID.
    /// @param _uri The new metadata URI.
    function setTokenURI(uint256 _tokenId, string memory _uri) external;

    /// @notice Checks whether the contract supports a given interface.
    /// @param interfaceId The interface identifier (as defined in ERC165).
    /// @return True if the interface is supported, false otherwise.
    function supportsInterface(bytes4 interfaceId) external view returns (bool);
}
