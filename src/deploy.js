/* eslint no-use-before-define: "warn" */
const hre = require("hardhat");
const {ethers} = hre;
const fs = require('fs-extra');

const deploy = async ( name ) => {
  const {deployments, getNamedAccounts} = hre;
  const { deploy } = deployments;
  const namedAccounts = await getNamedAccounts()

  console.log(`namedAccounts verifier=${JSON.stringify(namedAccounts)}`)
  
  const { verifier } = namedAccounts;
  console.log(`${name} verifier=${verifier}`)

  const result = await deploy(name, {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    from: verifier,
    // args: ["Hello"],
    log: true,
  });

  console.log(result)
}

if (require.main === module) {
  deploy('AuthPeteTimelightComVerifier')
} else {
  module.exports = deploy
}
