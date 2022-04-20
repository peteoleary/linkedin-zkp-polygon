const snarkjs = require("snarkjs");
const fs = require("fs");
const { expect } = require("chai");
const { equal } = require("assert");

test('loan circuit verifies', async () => {
    const input = JSON.parse(fs.readFileSync('./circuits/loan.json'))
    const { proof, publicSignals } = await snarkjs.groth16.fullProve(input, "./circuits/loan.wasm", "./circuits/loan.zkey");

    expect(parseInt(publicSignals[0])).to.eq(2000000)

    console.log("Proof: ");
    console.log(JSON.stringify(proof, null, 1));

    const vKey = JSON.parse(fs.readFileSync("./circuits/loan.vkey.json"));

    const res = await snarkjs.groth16.verify(vKey, publicSignals, proof);
    expect (res)
  });