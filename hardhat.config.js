require('hardhat-circom');
require('hardhat-deploy');
require('hardhat-deploy-ethers');

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.6.11",
  namedAccounts: {
    deployer: 0,
    tokenOwner: 1,
  },
  circom: {
    inputBasePath: "./circuits",
    ptau: "pot15_final.ptau",
    circuits: [
      {
        "name": "loan"
      }
    ],
  },
};
