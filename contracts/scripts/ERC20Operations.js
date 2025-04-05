// scripts/ERC20OOperations.js
const { ethers } = require("hardhat");

async function main() {
  // 取得 signer（帳戶）
  const [deployer, user] = await ethers.getSigners();

  // 取得 ERC20 合約實例，請替換 deployedAddress 為實際部署地址
  const deployedAddress = "0xC39dC34F9d25FBc5A13A62b1Ec3BE3033F1b1598";
  const myERC20 = await ethers.getContractAt("MyERC20", deployedAddress);

  // 查詢 deployer 的餘額 (balanceOf)
  const deployerAddress = await deployer.getAddress();
  let balance = await myERC20.balanceOf(deployerAddress);
  console.log("Deployer balance:", balance.toString());

  // 進行 approve 操作：deployer 授權 user 可以支配一定數量的 token
  const amountToApprove = ethers.parseUnits("1", 1); // 假設 token 小數點為 18
  let tx = await myERC20.approve(await user.getAddress(), amountToApprove);
  await tx.wait();
  console.log("Approved", amountToApprove.toString(), "tokens for", await user.getAddress());

  // user 呼叫 transferFrom，將 token 從 deployer 轉移到其他地址（例如 user 自己）
  tx = await myERC20.connect(user).transferFrom(deployerAddress, await user.getAddress(), amountToApprove);
  await tx.wait();
  console.log("Transferred", amountToApprove.toString(), "tokens from deployer to", await user.getAddress());

  // 再次查詢 deployer 與 user 的餘額
  balance = await myERC20.balanceOf(deployerAddress);
  console.log("Deployer balance after transfer:", balance.toString());
  balance = await myERC20.balanceOf(await user.getAddress());
  console.log("User balance after transfer:", balance.toString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  });