import { expect } from "./chai-setup";

import { ethers, deployments, getNamedAccounts } from 'hardhat';

describe("TicketOffice1 contract", function () {
  it("Should deploy the contract correctly", async function () {
    await deployments.fixture(["TicketOffice1"]);
    const { deployerAddress, randomAddress } = await getNamedAccounts();
    const TicketOffice1 = await ethers.getContract("TicketOffice1");
    const randomAddressBalance = await TicketOffice1.balanceOf(randomAddress);
    const deployerAddressBalance = await TicketOffice1.balanceOf(deployerAddress);
    expect(randomAddressBalance).to.equal(0);
    expect(deployerAddressBalance).to.equal(1);
  });
  it("Should set and get the transferDeadline", async function () {
    await deployments.fixture(["TicketOffice1"]);
    const TicketOffice1 = await ethers.getContract("TicketOffice1");

    // get1
    const tD_get1_bn = await TicketOffice1.get_transferDeadline();
    // Returns a BigNumber
    let tD_get1 = new Date(tD_get1_bn.toNumber());
    // console.log(typeof tD_get2);
    // console.log(`{ JSON.stringify(tD_get2, null, 2): ${JSON.stringify(tD_get2, null, 2)}}`);
    console.log(`{ tD_get2: ${tD_get1.toLocaleString()}}`);

    // set
    const tD_toset = new Date('January 01, 2222 00:00:00');
    console.log(`{ tD_toset: ${tD_toset.toLocaleString()}}`);
    await TicketOffice1.set_transferDeadline(tD_toset.getTime());

    // get2
    const tD_get2_bn = await TicketOffice1.get_transferDeadline();
    // Returns a BigNumber
    let tD_get2 = new Date(tD_get2_bn.toNumber());
    // console.log(typeof tD_get2);
    // console.log(`{ JSON.stringify(tD_get2, null, 2): ${JSON.stringify(tD_get2, null, 2)}}`);
    console.log(`{ tD_get2: ${tD_get2.toLocaleString()}}`);
    expect(tD_toset.getTime()).to.equal(tD_get2.getTime());
  });

  it("Should sell a ticket properly", async function () {
    await deployments.fixture(["TicketOffice1"]);
    const { buyer1Address } = await getNamedAccounts();
    // address of the signer is passed in the second parameter, otherwise deployer address i used
    const TicketOffice1 = await ethers.getContract("TicketOffice1", buyer1Address);
    const balanceBefore = await TicketOffice1.balanceOf(buyer1Address);
    expect(balanceBefore).to.equal(0);
    const txData = await TicketOffice1.buyTicket();
    // console.log({ hash: JSON.stringify(txData, null, 2) });
    // get tokenId
    await ethers.provider.waitForTransaction(txData.hash);
    const receipt = await ethers.provider.getTransactionReceipt(txData.hash);
    console.log({ receipt: JSON.stringify(receipt, null, 2) });
    const tokenId = parseInt(receipt.logs[0].topics[3], 16);
    console.log({ tokenId: tokenId });
    const balanceAfter = await TicketOffice1.balanceOf(buyer1Address);
    expect(balanceAfter).to.equal(1);
  });

});
