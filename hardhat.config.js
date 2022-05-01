const { Wallet } = require("ethers");

require('hardhat-circom');
require('hardhat-deploy');
require("@nomiclabs/hardhat-ethers");

require("hardhat-faucet")

const fs = require("fs");

/**
 * @type import('hardhat/config').HardhatUserConfig
 */

 const defaultNetwork = "hardhat";

 const keyPath = "./keys/"

 function mnemonic(which) {
  try {
    const phrase = fs.readFileSync(keyPath + `${which}.txt`).toString().trim();
    // check phrase validity
    let mnemonicWallet = Wallet.fromMnemonic(phrase);
    return mnemonicWallet
  } catch (e) {
    if (defaultNetwork !== "localhost") {
      console.log(
        "☢️ WARNING: No mnemonic file created for a deploy account. Try `yarn run generate` and then `yarn run account`."
      );
    }
  }
  return null;
}

const accounts = () => {
  const prover = mnemonic('prover')
  const verifier = mnemonic('verifier')
  if (prover && verifier) {
    return [{
      privateKey: prover.privateKey,
      balance: "5000000000000000000"
    }, {
      privateKey: verifier.privateKey,
      balance: "5000000000000000000"
    }]
  }
  return undefined
}



module.exports = {
  defaultNetwork,
  networks: {
    localhost: {
      url: "http://localhost:8545",
    },
    hardhat: {
      accounts: accounts()
    },
    mumbai: {
      url: "https://rpc-mumbai.maticvigil.com/",
      gasPrice: "auto",
    },
    matic: {
      url: "https://polygon-rpc.com/",
      gasPrice: "auto",
      gas: "auto",
      chainId: 137,
    },
  },
  solidity: "0.6.11",
  namedAccounts: {
    verifier: "privatekey://" + mnemonic('verifier').privateKey
  },
  circom: {
    inputBasePath: "./circuits",
    ptau: "pot15_final.ptau",
    circuits: [
      {
        "name": "loan",
        "protocol": "plonk"
      },
      {
        "name": "auth",
        "protocol": "plonk",
      }
    ],
  },
};

task(
  "generate",
  "Create a mnemonic for blockchain deploys")
  .addParam("whichParty", "Which named party to create key for: verifier or prover")
  .setAction(async (taskArgs, { network, ethers }) => {
    const bip39 = require("bip39");
    const hdkey = require("ethereumjs-wallet");
    const mnemonic = bip39.generateMnemonic();
    
    const seed = await bip39.mnemonicToSeed(mnemonic);
    
    const hdwallet = hdkey.hdkey.fromMasterSeed(seed);
    const wallet_hdpath = "m/44'/60'/0'/0/";
    const account_index = 0;
    let fullPath = wallet_hdpath + account_index;
    
    const wallet = hdwallet.derivePath(fullPath).getWallet();
    // const privateKey = "0x" + wallet.privKey.toString("hex");
   
    var EthUtil = require("ethereumjs-util");
    const address =
      "0x" + EthUtil.privateToAddress(wallet.privKey).toString("hex");
    console.log(
      "🔐 Account Generated as " + address
    );

    fs.writeFileSync(keyPath + address + ".txt", mnemonic.toString());
    fs.writeFileSync(keyPath + `${taskArgs.whichParty}.txt`, mnemonic.toString());
  }
);

task("accounts", "Prints the list of accounts", async (_, { ethers }) => {
  ['prover', 'verifier'].forEach((which) => console.log(which + ': ' + mnemonic(which).address));
});
