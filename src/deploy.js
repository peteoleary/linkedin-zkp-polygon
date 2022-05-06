/* eslint no-use-before-define: "warn" */
const hre = require("hardhat");
const {ethers} = hre;
const fs = require('fs-extra');

const deploy1 = async (name) => {
  const [owner] = await ethers.getSigners();

  const Token = await ethers.getContractFactory(name);

  const hardhatToken = await Token.deploy();
}

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

async function deploy2 (name) {
  const {deployments, getNamedAccounts} = hre;
  const { deploy } = deployments;
  const namedAccounts = await getNamedAccounts()
  console.log(`namedAccounts verifier=${JSON.stringify(namedAccounts)}`)
  const { verifier } = namedAccounts;

  let compiled = require(`./build/${name}.json`);
  console.log(`\nDeploying ${name} in ${config["network"]}...`);
  
  let contract = new ethers.ContractFactory(
    compiled.abi,
    compiled.bytecode,
    verifier
  );

  let instance =  await contract.deploy();

  console.log(`deployed at ${instance.address}`)
  config[`${process.argv[2]}`] = instance.address
  console.log("Waiting for the contract to get mined...")
  await instance.deployed()
  console.log("Contract deployed")
  fs.outputJsonSync(
    'config.json',
    config,
    {
      spaces:2,
      EOL: "\n" 
    }
  );
}

if (require.main === module) {
  deploy('AuthPeteTimelightComVerifier')
} else {
  module.exports = deploy
}
