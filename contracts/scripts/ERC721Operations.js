// scripts/ERC721Operations.js
const { ethers } = require("hardhat");

async function main() {
    // 取得第一個簽署者，假設該帳戶同時具備 MINTER_ROLE 與 DEFAULT_ADMIN_ROLE
    const [deployer] = await ethers.getSigners();
    const deployerAddress = await deployer.getAddress();
    console.log("Using deployer account:", deployerAddress);
  
    // 請替換為您已部署的 MyERC721 合約地址
    const myERC721Address = "0x4fad89714c46D3304D790182943EF92492a4b161";
    // 取得合約實例（ABI 從 artifacts 自動生成）
    const myERC721 = await ethers.getContractAt("MyERC721", myERC721Address);
  
    // // 調用 safeMint 函式鑄造 NFT
    // console.log("Calling safeMint...");
    // const txMint = await myERC721.safeMint(deployerAddress);
    // const receiptMint = await txMint.wait();
    // console.log("safeMint transaction mined:", await receiptMint.transactionHash);
  
    // // 假設 safeMint 使用的是自動遞增計數器，首次鑄造 tokenId 為 0
    // const tokenId = 1;
    // // 設定對應的 token URI
    // const newTokenURI = "https://gateway.pinata.cloud/ipfs/QmS7cWZGZ8rS2cSc4dEYrVxPGbQnhqgiweGUHwhuJoKAnH";
    // console.log("Calling setTokenURI for tokenId:", tokenId);
    // const txSetURI = await myERC721.setTokenURI(tokenId, newTokenURI);
    // const receiptSetURI = await txSetURI.wait();
    // console.log("setTokenURI transaction mined:", await receiptSetURI.transactionHash);
  
    // // 查詢設定結果 (若合約有對應 getter 函式)
    // // 例如：const tokenURI = await myERC721.tokenURI(tokenId);
    // // console.log("Token URI:", tokenURI);

    // transfer NFT
    const recipientAddress = "0x7F8656696A76c26C463f0DdaCE4a039eCff6118D"; // 替換為接收者地址
    const tokenId = 1; // 替換為要轉移的 tokenId
    console.log("Calling transferFrom...");
    const txTransfer = await myERC721.transferFrom(deployerAddress, recipientAddress, tokenId);
    const receiptTransfer = await txTransfer.wait();
    console.log("transferFrom transaction mined:", await receiptTransfer.transactionHash);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("Error:", error);
      process.exit(1);
    });