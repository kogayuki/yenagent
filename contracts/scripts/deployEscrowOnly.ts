/**
 * EscrowLite単体デプロイ（Escrow.sol よりサイズ削減版）
 */
import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Deploying EscrowLite with:", deployer.address);
  console.log("Balance:", ethers.formatEther(balance), "POL");

  // 事前見積もり
  const Factory = await ethers.getContractFactory("EscrowLite");
  const deployTx = await Factory.getDeployTransaction();
  const gasEst = await ethers.provider.estimateGas(deployTx);
  const gasPrice = (await ethers.provider.getFeeData()).gasPrice ?? 0n;
  const cost = gasEst * gasPrice;
  console.log(`予測gas: ${gasEst}, gasPrice: ${ethers.formatUnits(gasPrice, "gwei")} gwei, 必要POL: ${ethers.formatEther(cost)}`);

  if (balance < cost) {
    throw new Error(`残高不足: ${ethers.formatEther(balance)} POL, 必要: ${ethers.formatEther(cost)} POL`);
  }

  const escrow = await Factory.deploy();
  await escrow.waitForDeployment();
  const escrowAddr = await escrow.getAddress();
  console.log("\n✅ EscrowLite deployed at:", escrowAddr);
  console.log("\n.env に追加:");
  console.log(`ESCROW_CONTRACT_ADDRESS=${escrowAddr}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
