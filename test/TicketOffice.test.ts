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
  it("Should set and get the transferDeadline - caller has ROLE_ADMIN", async function () {
    await deployments.fixture(["TicketOffice1"]);
    const TicketOffice1 = await ethers.getContract("TicketOffice1");

    // get1
    const tD_get1_bn = await TicketOffice1.get_transferDeadline();
    // Returns a BigNumber
    let tD_get1 = new Date(tD_get1_bn.toNumber());
    // console.log(typeof tD_get2);
    // console.log(`{ JSON.stringify(tD_get2, null, 2): ${JSON.stringify(tD_get2, null, 2)}}`);
    console.log(`{ tD_get1: ${tD_get1.toLocaleString()}}`);

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

  it("Should not set the transferDeadline - caller has not ROLE_ADMIN", async function () {
    await deployments.fixture(["TicketOffice1"]);
    const { randomAddress } = await getNamedAccounts();
    // address of the signer is passed in the second parameter, otherwise deployer address is used
    const TicketOffice1 = await ethers.getContract("TicketOffice1", randomAddress);

    // get1
    const tD_get1_bn = await TicketOffice1.get_transferDeadline();
    // Returns a BigNumber
    let tD_get1 = new Date(tD_get1_bn.toNumber());
    // console.log(typeof tD_get2);
    // console.log(`{ JSON.stringify(tD_get2, null, 2): ${JSON.stringify(tD_get2, null, 2)}}`);
    console.log(`{ tD_get1: ${tD_get1.toLocaleString()}}`);

    // set
    const tD_toset = new Date('January 01, 2222 00:00:00');
    console.log(`{ tD_toset: ${tD_toset.toLocaleString()}}`);
    await expect(TicketOffice1.set_transferDeadline(tD_toset.getTime())).to.be.reverted;
  });

  it("Should sell a ticket properly - caller has not ROLE_ADMIN", async function () {
    await deployments.fixture(["TicketOffice1"]);

    // SETUP
    const { buyer1Address } = await getNamedAccounts();
    // address of the signer is passed in the second parameter, otherwise deployer address is used
    const TicketOffice1 = await ethers.getContract("TicketOffice1", buyer1Address);

    const balanceTicketBefore = await TicketOffice1.balanceOf(buyer1Address);
    expect(balanceTicketBefore).to.equal(0);

    let balanceValueBefore = (await ethers.provider.getBalance(buyer1Address));
    console.log(`{ balanceValueBefore: ${parseFloat(ethers.utils.formatEther(balanceValueBefore))}}`);

    let valueSent = ethers.utils.parseEther("1.0");

    // EXECUTE
    const txData = await TicketOffice1.buyTicket(false, { value: valueSent });
    // console.log({ hash: JSON.stringify(txData, null, 2) });

    // VERIFY
    let ticketPrice = await TicketOffice1.get_ticketPrice();
    console.log(`{ ticketPrice: ${parseFloat(ethers.utils.formatEther(ticketPrice))}}`);

    let valueResidueExpected = valueSent.sub(ticketPrice);
    console.log(`{ valueResidueExpected: ${valueResidueExpected}}`);

    await ethers.provider.waitForTransaction(txData.hash);
    let balanceValueAfter = (await ethers.provider.getBalance(buyer1Address));
    console.log(`{ balanceValueBefore: ${parseFloat(ethers.utils.formatEther(balanceValueBefore))} ETH}`);
    console.log(`{ balanceValueAfter : ${parseFloat(ethers.utils.formatEther(balanceValueAfter))} ETH}`);
    expect(parseFloat(ethers.utils.formatEther(balanceValueBefore))).to.be.closeTo(parseFloat(ethers.utils.formatEther(balanceValueAfter)), 2);

    const receipt = await ethers.provider.getTransactionReceipt(txData.hash);
    // console.log({ receipt: JSON.stringify(receipt, null, 2) });
    const tokenId = parseInt(receipt.logs[0].topics[3], 16);
    console.log({ tokenId: tokenId });
    const balanceTicketAfter = await TicketOffice1.balanceOf(buyer1Address);
    console.log(`{ balanceTicketBefore: ${balanceTicketBefore}}`);
    console.log(`{ balanceTicketAfter: ${balanceTicketAfter}}`);
    expect(balanceTicketAfter).to.equal(1);
  });

});
