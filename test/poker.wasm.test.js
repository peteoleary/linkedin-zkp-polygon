const snarkjs = require("snarkjs");
const fs = require("fs");

test('poker circuit verifies', async () => {
    const { proof, publicSignals } = await snarkjs.groth16.fullProve({"cards": [8, 7, 9, 10, 13], "isFold": 1, "isSee": 0, "raise": 0 }, "./circuits/poker.wasm", "./circuits/poker.zkey");

    console.log("Proof: ");
    console.log(JSON.stringify(proof, null, 1));

    const vKey = JSON.parse(fs.readFileSync("./circuits/poker.vkey.json"));

    const res = await snarkjs.groth16.verify(vKey, publicSignals, proof);

    expect (res)
  });