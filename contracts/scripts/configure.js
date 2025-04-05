// scripts/configure.js

async function main() {
  const [deployer, lender] = await ethers.getSigners();

  // 請將 deployedAddress 替換為您已部署的 lendingProtocol 合約地址
  const deployedAddress = "0x4AB19ea1831d42109b3DeF47d15335e2949588E9";

  // 取得已部署的合約實例
  const lendingProtocol = await ethers.getContractAt("lendingProtocol", deployedAddress);
  console.log("Loaded lendingProtocol at:", deployedAddress);

  // 請將 stablecoinAddress 替換為實際穩定幣合約地址（例如 MyERC20 合約地址）
  const stablecoinAddress = "0x0d80978aFA9c9185925a639847011Ed570a700f9";

  // 設定 acceptedStablecoin
  let tx = await lendingProtocol.setAcceptedStablecoin(stablecoinAddress, true);
  await tx.wait();
  console.log("Accepted stablecoin set to:", stablecoinAddress);

  // 設定白名單 (lender whitelist)，例如將第二個 signer 加入白名單
  tx = await lendingProtocol.setLenderWhitelist("0x7F8656696A76c26C463f0DdaCE4a039eCff6118D", true);
  await tx.wait();
  console.log("Lender whitelisted:", "0x7F8656696A76c26C463f0DdaCE4a039eCff6118D");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  });
