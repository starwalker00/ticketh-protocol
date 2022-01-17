// deploy/00_deploy_TicketOffice.ts
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;

  const { deployerAddress } = await getNamedAccounts();

  // get params for solidity constructor
  // const date = Date.parse('01 Jan 1970 00:00:00 GMT');
  let transferDeadline = new Date(); // now
  let minutes = 2;
  console.log(transferDeadline.toLocaleString())
  transferDeadline.setMinutes(transferDeadline.getMinutes() + minutes);
  console.log(transferDeadline.toLocaleString())

  await deploy('TicketOffice1', {
    from: deployerAddress,
    log: true,
    args: [transferDeadline.getTime()],
  });
};
export default func;
func.tags = ['TicketOffice1'];
