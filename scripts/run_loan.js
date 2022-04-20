const { ethers, deployments, getNamedAccounts } = require("hardhat");
const snarkjs = require("snarkjs");

const ffjavascript = require('ffjavascript')
const unstringifyBigInts = ffjavascript.utils.unstringifyBigInts

function p256$1(n) {
  let nstr = n.toString(16);
  while (nstr.length < 64) nstr = "0"+nstr;
  nstr = `0x${nstr}`;
  return nstr;
}

function groth16ExportSolidityCallData(proof, pub) {

  let inputs = "";
  for (let i=0; i<pub.length; i++) {
      if (inputs != "") inputs = inputs + ",";
      inputs = inputs + p256$1(pub[i]);
  }

  const a = [p256$1(proof.pi_a[0]), p256$1(proof.pi_a[1])]
  const b = [[p256$1(proof.pi_b[0][1]), p256$1(proof.pi_b[0][0])],[p256$1(proof.pi_b[1][1]), p256$1(proof.pi_b[1][0])]]
  const c = [p256$1(proof.pi_c[0]), p256$1(proof.pi_c[1])]
  const i = [inputs]

  return [a, b, c, i];
}

const main = async () => {
  
    await deployments.fixture(["Verifier"]);
    const {deployer, tokenOwner} = await getNamedAccounts();
    const loan_verifier = await ethers.getContract("Verifier", deployer);

    const { proof, publicSignals } = await snarkjs.groth16.fullProve({income: 300000}, "./circuits/loan.wasm", "./circuits/loan.zkey")
    // from https://githubhot.com/repo/iden3/snarkjs/issues/112
    const [a, b, c, i] = groth16ExportSolidityCallData(unstringifyBigInts(proof), unstringifyBigInts(publicSignals))

    const output = await loan_verifier.verifyProof(a, b, c, i);

    console.log(output)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });