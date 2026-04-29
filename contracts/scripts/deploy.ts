import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);
  console.log("Balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  // 1. MockJPYC
  const MockJPYC = await ethers.getContractFactory("MockJPYC");
  const jpyc = await MockJPYC.deploy();
  await jpyc.waitForDeployment();
  const jpycAddr = await jpyc.getAddress();
  console.log("MockJPYC deployed at:", jpycAddr);

  // 2. Escrow
  const Escrow = await ethers.getContractFactory("Escrow");
  const escrow = await Escrow.deploy();
  await escrow.waitForDeployment();
  const escrowAddr = await escrow.getAddress();
  console.log("Escrow  deployed at:", escrowAddr);

  console.log("\n.env に貼り付け:");
  console.log(`MOCK_JPYC_ADDRESS=${jpycAddr}`);
  console.log(`ESCROW_CONTRACT_ADDRESS=${escrowAddr}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
