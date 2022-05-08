// deploy/00_deploy_your_contract.js

module.exports = async (hre) => {
    const {deployments, getNamedAccounts} = hre;
    const { deploy } = deployments;
    const namedAccounts = await getNamedAccounts()
    console.log(`namedAccounts verifier=${JSON.stringify(namedAccounts)}`)
    const { verifier } = namedAccounts;
    console.log(`LoanVerifier verifier=${verifier}`)
    const result = await deploy("LoanVerifier", {
      // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
      from: verifier,
      // args: ["Hello"],
      log: true,
    });

    console.log(result)
  
    /*
      // Getting a previously deployed contract
      const YourContract = await ethers.getContract("YourContract", deployer);
      await YourContract.setPurpose("Hello");
      
      //const yourContract = await ethers.getContractAt('YourContract', "0xaAC799eC2d00C013f1F11c37E654e59B0429DF6A") //<-- if you want to instantiate a version of a contract at a specific address!
    */
  };
  module.exports.tags = ["LoanVerifier"];
  
  /*
  Tenderly verification
  let verification = await tenderly.verify({
    name: contractName,
    address: contractAddress,
    network: targetNetwork,
  });
  */
  