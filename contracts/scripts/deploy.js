// scripts/deploy.js
const { ethers, upgrades } = require("hardhat");

async function main() {
  // 取得部署者的帳戶
  const [deployer] = await ethers.getSigners();
  const deployerAddress = await deployer.getAddress(); // 使用 getAddress() 取得地址
  console.log("Deploying contracts with the account:", deployerAddress);
  console.log("Account balance:", (await deployer.provider.getBalance(deployerAddress)).toString());

  // 部署 MyERC20 合約 (假設初始化沒有參數，如果有請補上)
  const MyERC20 = await ethers.getContractFactory("MyERC20");
  const myERC20 = await upgrades.deployProxy(MyERC20, [100000000], { initializer: "initialize" });
  const myERC20Address = await myERC20.getAddress();
  // 不需要呼叫 deployed()
  console.log("MyERC20 deployed to:", myERC20Address);


  // 部署 MyERC721 合約 (假設初始化傳入名稱與符號)
  const MyERC721 = await ethers.getContractFactory("MyERC721");
  const myERC721 = await upgrades.deployProxy(MyERC721, ["My NFT", "MNFT"], { initializer: "initialize" });
  const myERC721Address = await myERC721.getAddress();
  console.log("MyERC721 deployed to:", myERC721Address);

  // 部署 MyERC1155 合約 (初始化時傳入 base URI)
  const MyERC1155 = await ethers.getContractFactory("MyERC1155");
  const myERC1155 = await upgrades.deployProxy(MyERC1155, ["https://example.com/metadata/{id}.json", deployerAddress], { initializer: "initialize" });
  const myERC1155Address = await myERC1155.getAddress();
  console.log("MyERC1155 deployed to:",myERC1155Address);

  // 部署 lendingProtocol 合約 (根據您的合約初始化參數進行修改)
  const LendingProtocol = await ethers.getContractFactory("lendingProtocol");
  // 例如初始化傳入 base URI 與 admin 地址
  const lendingProtocol = await upgrades.deployProxy(LendingProtocol, ["https://example.com/lendingBaseURI/", deployerAddress], { initializer: "initialize" });
  const lendingProtocolAddress = await lendingProtocol.getAddress();
  console.log("lendingProtocol deployed to:", lendingProtocolAddress);

  // 如果需要，可以將其他合約地址配置到 lendingProtocol，例如：
  // await lendingProtocol.setERC20Address(myERC20.address);
  // await lendingProtocol.setERC721Address(myERC721.address);
  // await lendingProtocol.setERC1155Address(myERC1155.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment error:", error);
    process.exit(1);
  });
