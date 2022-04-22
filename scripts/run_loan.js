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

// lifted and modified from snarkjs
function groth16ExportSolidityCallData(proof, pub) {

  const inputs = pub.map(x => p256$1(x));

  const a = [p256$1(proof.pi_a[0]), p256$1(proof.pi_a[1])]
  const b = [[p256$1(proof.pi_b[0][1]), p256$1(proof.pi_b[0][0])],[p256$1(proof.pi_b[1][1]), p256$1(proof.pi_b[1][0])]]
  const c = [p256$1(proof.pi_c[0]), p256$1(proof.pi_c[1])]

  return [a, b, c, inputs];
}

const main = async () => {

  const {verifier, _} = await getNamedAccounts();

  const network = await ethers.provider.getNetwork();

  if (network.name == 'unknown') {
    await deployments.fixture(["Verifier"]);
  }
    
  const loan_verifier = await ethers.getContract("Verifier", verifier);

  const { proof, publicSignals } = await snarkjs.groth16.fullProve({income: 300000, nonce: '0x1234567890abcdef'}, "./circuits/loan.wasm", "./circuits/loan.zkey")
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