import { expect } from "chai";
import { ethers } from "hardhat";

describe("Escrow", () => {
  it("3分割マイルストーンを順番通り release できる", async () => {
    const [payer, payee, agent] = await ethers.getSigners();

    const MockJPYC = await ethers.getContractFactory("MockJPYC");
    const jpyc = await MockJPYC.connect(payer).deploy();
    await jpyc.waitForDeployment();

    const Escrow = await ethers.getContractFactory("Escrow");
    const escrow = await Escrow.deploy();
    await escrow.waitForDeployment();

    const amount = ethers.parseUnits("30000", 18); // 30,000 JPYC
    await jpyc.connect(payer).approve(await escrow.getAddress(), amount);

    const tx = await escrow.connect(payer).createEscrow(
      payer.address,
      payee.address,
      await jpyc.getAddress(),
      amount,
      3,
      "INV-TEST",
    );
    const receipt = await tx.wait();
    const escrowId = 0n;

    // agent set
    await escrow.connect(payer).setAgent(escrowId, agent.address);

    // milestone 1
    await escrow.connect(agent).release(escrowId, 1);
    expect(await jpyc.balanceOf(payee.address)).to.equal(ethers.parseUnits("10000", 18));

    // milestone 2
    await escrow.connect(agent).release(escrowId, 2);
    expect(await jpyc.balanceOf(payee.address)).to.equal(ethers.parseUnits("20000", 18));

    // milestone 3 (端数含む)
    await escrow.connect(agent).release(escrowId, 3);
    expect(await jpyc.balanceOf(payee.address)).to.equal(amount);
  });

  it("順番を飛ばすと revert する", async () => {
    const [payer, payee] = await ethers.getSigners();

    const MockJPYC = await ethers.getContractFactory("MockJPYC");
    const jpyc = await MockJPYC.connect(payer).deploy();
    const Escrow = await ethers.getContractFactory("Escrow");
    const escrow = await Escrow.deploy();

    const amount = ethers.parseUnits("3000", 18);
    await jpyc.connect(payer).approve(await escrow.getAddress(), amount);
    await escrow.connect(payer).createEscrow(
      payer.address,
      payee.address,
      await jpyc.getAddress(),
      amount,
      3,
      "INV-X",
    );
    await expect(escrow.connect(payer).release(0n, 2)).to.be.reverted;
  });
});
