import { expect } from "./chai-setup";

import { ethers, deployments, getNamedAccounts } from 'hardhat';

describe("TicketOffice1 contract", function () {
  it("Should deploy the contract correctly", async function () {
    await deployments.fixture(["TicketOffice1"]);
    const { deployer } = await getNamedAccounts();
    const TicketOffice1 = await ethers.getContract("TicketOffice1");
    const deployerBalance = await TicketOffice1.balanceOf(deployer);
    expect(deployerBalance).to.equal(0);
  });
  it("Should assign the first tokenid NFT to the owner", async function () {
    await deployments.fixture(["TicketOffice1"]);
    const { deployer } = await getNamedAccounts();
    const TicketOffice1 = await ethers.getContract("TicketOffice1");
    await TicketOffice1.mintFirst()
    let deployerBalance = await TicketOffice1.balanceOf(deployer);
    expect(deployerBalance).to.equal(1);
    let ownerOfTokenid0 = await TicketOffice1.ownerOf(0);
    expect(ownerOfTokenid0).to.equal(deployer);
  });
  it("Should not assign the first tokenid twice", async function () {
    await deployments.fixture(["TicketOffice1"]);
    const { deployer } = await getNamedAccounts();
    const TicketOffice1 = await ethers.getContract("TicketOffice1");
    await TicketOffice1.mintFirst()
    let deployerBalance = await TicketOffice1.balanceOf(deployer);
    expect(deployerBalance).to.equal(1);
    await expect(TicketOffice1.mintFirst()).to.be.reverted;
    deployerBalance = await TicketOffice1.balanceOf(deployer);
    expect(deployerBalance).to.equal(1);
  });
});