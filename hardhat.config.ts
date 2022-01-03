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
    deployer: 0,
    buyer: 1,
  },
};
export default config;