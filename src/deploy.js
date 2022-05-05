/* eslint no-use-before-define: "warn" */
const hre = require("hardhat");

const compile = async ( name ) => {
  hre.run('compile')
}

const deploy = async ( name ) => {
  const {deployments, getNamedAccounts} = hre;
  const { deploy } = deployments;
  const namedAccounts = await getNamedAccounts()
  console.log(`namedAccounts verifier=${JSON.stringify(namedAccounts)}`)
  const { verifier } = namedAccounts;
  console.log(`LoanVerifier verifier=${verifier}`)
  const result = await deploy(name, {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    from: verifier,
    // args: ["Hello"],
    log: true,
  });

  console.log(result)
}

module.exports = {compile, deploy}