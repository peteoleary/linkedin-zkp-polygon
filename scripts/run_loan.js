const { ethers, deployments, getNamedAccounts } = require("hardhat");
const snarkjs = require("snarkjs");

const ffjavascript = require('ffjavascript')
const unstringifyBigInts = ffjavascript.utils.unstringifyBigInts


const main = async () => {
  
    await deployments.fixture(["PokerVerifier"]);
    const {deployer, tokenOwner} = await getNamedAccounts();
    const poker_verifier = await ethers.getContract("PokerVerifier", deployer);

    const { proof, publicSignals } = await snarkjs.groth16.fullProve({"cards": [8, 7, 9, 10, 13], "isFold": 1, "isSee": 0, "raise": 0 }, "./circuits/poker.wasm", "./circuits/poker.vkey.json")
    // from https://githubhot.com/repo/iden3/snarkjs/issues/112
    const calldata = await snarkjs.groth16.exportSolidityCallData(unstringifyBigInts(proof), unstringifyBigInts(publicSignals))
    // const calldataSplit = calldata.split(',')
    // const proofFormatted = calldataSplit[0]
    // const publicSignalsFormatted = JSON.parse(values[1]).map(x => BigInt(x).toString())
    
    const a = ["0x25a5c924a18e4f8147644b5eb14879b9451d3f027b55867fc05f83865134ddc7", "0x2d23f971890e243cdc3299ad87d3691cfca06332c1887c6fe0dcf4c7ad7d1053"]
    const b = [["0x15918175bbf4fc75bd9a12e2c31e7ddfdb944a7e1b83f30d407bed4d4caa0853", "0x0a1c556b093c16993d61b275723b73cdacc610b2ee49e695bc14bd4e0f389e85"],["0x012eb21d9f3f4c4244194e232bfa74d07e5b20afc4a5b2897c3b9dbda9426f8c", "0x2dc983f459048eae3f984101610775466021378ab293bd0aea6282bf8efe053d"]]
    const c = ["0x197a136a659d32dd5497ceb405373572bf3ce20eb479bd3fcdf8075acdfe5a05", "0x221de82bc8222442c699c96cb234cf47a0d446855eb58924b83c53ecd0101b36"]
    const i = ["0x0000000000000000000000000000000000000000000000000000000000000001"]

    const output = await poker_verifier.verifyProof(a, b, c, i);

    console.log(output)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });