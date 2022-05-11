/* eslint no-use-before-define: "warn" */
const hre = require("hardhat");
const {ethers, deployments, getNamedAccounts} = hre;
const fs = require('fs-extra');


const deploy = async ( name, deployer = null ) => {

  const network = await deployments.getNetworkName();

  if (network.name == 'hardhat') {
      await deployments.fixture([name]);
  }

  if (!deployer) {
    const namedAccounts = await getNamedAccounts()
    console.log(`namedAccounts namedAccounts=${JSON.stringify(namedAccounts)}`)

    const { verifier } = namedAccounts;
    deployer = verifier
  }

  console.log(`${name} deployer=${deployer}`)
  const result = await deployments.deploy(name, {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    from: deployer,
    // args: ["Hello"],
    log: true,
  });

  return result
}

if (require.main === module) {
  deploy('AuthPeteTimelightComVerifier')
} else {
  module.exports = deploy
}
