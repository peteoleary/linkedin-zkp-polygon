const snarkjs = require("snarkjs");
const fs = require("fs");
const { expect } = require("chai");

test('loan applicant qualifies', async () => {
    const { _ , publicSignals } = await snarkjs.groth16.fullProve({income: 300000}, "./circuits/loan.wasm", "./circuits/loan.zkey");

    expect(parseInt(publicSignals[0])).to.eq(1)
});

test('loan applicant does not qualify', async () => {
  const { _, publicSignals } = await snarkjs.groth16.fullProve({income: 30000}, "./circuits/loan.wasm", "./circuits/loan.zkey");

  expect(parseInt(publicSignals[0])).to.eq(0)
});