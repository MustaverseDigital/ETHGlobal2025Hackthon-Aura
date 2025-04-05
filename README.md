# ETHGlobal2025Hackthon-Aura

**Unlock diamond liquidity via fractionalized RWA lending with fixed-income bond-like notes, off-chain permit approvals, and borrower nationality verification via Self Protocol.**

## Overview

Our project addresses the liquidity challenges of diamond real-world assets by fractionalizing high-value diamonds into tradable tokens. Borrowers can secure loans using these diamond fractions as collateral, while lenders receive fixed-income loan notes—similar to bonds—whose market price fluctuates with changes in interest rate spreads. These fluctuations, resulting from the yield spread between fixed returns and prevailing market interest rates, mimic traditional bond trading dynamics.

To enhance efficiency and reduce gas costs, our system integrates off-chain permit functionalities for ERC20, ERC721, and ERC1155 tokens, allowing seamless authorization via digital signatures without requiring multiple on-chain approval transactions. Furthermore, to meet legal and regulatory requirements for real-world assets (RWA), we utilize Self Protocol to verify borrower nationality. In addition, the protocol employs an AI Agent to provide real-time valuation of diamond assets, further enhancing transparency and enabling informed decision-making.

![diamond real-world assets](https://imgur.com/bHRjXGu)

![notes]([URL_or_relative_path](https://imgur.com/a/rK4gfd9))

## Features

- **Fractionalized Diamond Assets:**  
  High-value diamonds are tokenized and fractionalized into tradable tokens, unlocking liquidity for diamond assets.

- **Fixed-Income Loan Notes:**  
  Lenders receive bond-like fixed-income loan notes. Their market price fluctuates with the yield spread between fixed returns and market interest rates.

- **Off-Chain Permit Approvals:**  
  Integrated permit functionality for ERC20, ERC721, and ERC1155 tokens enables gas-efficient, seamless authorization via digital signatures.

- **Nationality Verification:**  
  Self Protocol is employed to verify borrower nationality, ensuring that only eligible parties can participate in the system, thus meeting regulatory requirements.

## How It Works

1. **Asset Fractionalization:**  
   High-value diamonds are converted into tradable tokens by fractionalizing the asset.

2. **Loan Issuance:**  
   Borrowers deposit their diamond fractions as collateral to secure loans, and lenders receive fixed-income loan notes that function similarly to bonds.

3. **Yield Spread Trading:**  
   The market price of the loan notes fluctuates due to the yield spread between their fixed returns and current market interest rates.

4. **Off-Chain Permits:**  
   The system uses off-chain permit functionality for ERC20, ERC721, and ERC1155 tokens, allowing users to authorize transactions via digital signatures without extra on-chain approval transactions.

5. **Regulatory Compliance:**  
   Self Protocol is used to verify borrower nationality, ensuring the platform complies with RWA legal and regulatory standards.

6. **AI Agent Valuation:**  
   An AI Agent provides real-time valuation of diamond assets, enhancing transparency and enabling more informed lending and investment decisions.

## Deployment

### Polygon Amoy
- **lendingProtocol deployed to:** `0x20e64D450b8eF4d1E2c396d638569000a3273431`

### Hashkey Testnet
- **lendingProtocol deployed to:** `0x4AB19ea1831d42109b3DeF47d15335e2949588E9`

## Backend

The backend services that support the protocol are available here:  
[Backend Repository (Aura_server)](https://github.com/abcd5251/Aura_server)

## License

This project is licensed under the MIT License.
