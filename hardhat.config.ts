import { HardhatUserConfig } from 'hardhat/types';
import 'hardhat-deploy';
import 'hardhat-deploy-ethers';
import { node_url, accounts } from './utils/network';

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.1',
  },
  defaultNetwork: "hardhat",
  networks: {
    rinkeby: {
      url: node_url('rinkeby'),
      accounts: accounts('rinkeby'),
    },
  },
  namedAccounts: {
    deployerAddress: 0,
    buyer1Address: 1,
    randomAddress: 12
  },
};
export default config;