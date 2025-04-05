// scripts/loanOperations.js
const { ethers } = require("hardhat");

async function main() {
  // Get at least two signers: borrower and lender.
  const signers = await ethers.getSigners();
  const borrower = signers[0];
  const lender = signers.length > 1 ? signers[1] : borrower; // if only one signer is available, use the same for testing

  // Replace with your deployed lendingProtocol contract address.
  const lendingProtocolAddress = "0x20e64D450b8eF4d1E2c396d638569000a3273431";
  // Get the deployed lendingProtocol contract instance.
  const lendingProtocol = await ethers.getContractAt("lendingProtocol", lendingProtocolAddress);

  // --- Borrower submits a loan request ---
  // Set the stablecoin address (replace with your actual stablecoin address).
  const stablecoinAddress = "0xC39dC34F9d25FBc5A13A62b1Ec3BE3033F1b1598";

  const NFTAddress = "0x4fad89714c46D3304D790182943EF92492a4b161"; // Example ERC721 address
  // Set loan parameters.
  // For ethers v6, use ethers.parseUnits to convert to BigNumber.
  const loanAmount = ethers.parseUnits("100", 1); // Loan amount of 100 tokens (assuming 18 decimals)
  const interestRate = 5; // 5%
  const duration = 30 * 24 * 3600; // 30 days in seconds
  const inquiryDuration = 24 * 3600; // 1 day in seconds

  // Define collateral assets.
  // Here we assume a simple example with one ERC20 asset.
  // Note: AssetType.ERC20 is represented by 0.
  const collateralAssets = [
    {
      assetType: 1, // ERC20
      assetAddress: NFTAddress, // For example purposes, using the stablecoin as collateral.
      tokenId: 0, // Not used for ERC20.
    }
  ];

  console.log("Borrower submitting loan request...");
  let tx = await lendingProtocol.connect(borrower).requestLoan(
    stablecoinAddress,
    loanAmount,
    interestRate,
    duration,
    inquiryDuration,
    collateralAssets
  );
  let receipt = await tx.wait();
  console.log("Loan requested, transaction hash:", receipt.transactionHash);

  // Assume that the loanId is the previous nextLoanId (i.e., nextLoanId - 1)
  // Note: In ethers v6, arithmetic on BigNumbers is done using methods.
  const nextLoanId = await lendingProtocol.nextLoanId();
  // If nextLoanId is a BigNumber, subtract 1:
  const loanId = nextLoanId.sub(1);
  console.log("Loan ID:", loanId.toString());

  // --- Lender funds the loan ---
  // (Make sure the lender is whitelisted in your contract)
  console.log("Lender funding the loan...");
  tx = await lendingProtocol.connect(lender).fundLoan(loanId);
  receipt = await tx.wait();
  console.log("Loan funded, transaction hash:", receipt.transactionHash);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  });
