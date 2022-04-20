const snarkjs = require("snarkjs");
const fs = require("fs");
const { expect } = require("chai");

test('loan applicant qualifies', async () => {
    const { _ , publicSignals } = await snarkjs.groth16.fullProve({income: 300000, nonce: '0x1234567890abcdef'}, "./circuits/loan.wasm", "./circuits/loan.zkey");

    expect(parseInt(publicSignals[0])).to.eq(1)
    expect(parseInt(publicSignals[1])).to.eq(1)
});

test('loan applicant does not qualify', async () => {
  const { _, publicSignals } = await snarkjs.groth16.fullProve({income: 30000, nonce: '0x1234567890abcdef'}, "./circuits/loan.wasm", "./circuits/loan.zkey");

  expect(parseInt(publicSignals[0])).to.eq(0)
  expect(parseInt(publicSignals[1])).to.eq(1)
});

test('loan applicant tampered with data', async () => {
  const { _, publicSignals } = await snarkjs.groth16.fullProve({income: 3000000, nonce: '0xfedcba0987654321'}, "./circuits/loan.wasm", "./circuits/loan.zkey");

  expect(parseInt(publicSignals[0])).to.eq(1)
  expect(parseInt(publicSignals[1])).to.eq(0)
});