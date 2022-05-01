const snarkjs = require("snarkjs");
const fs = require("fs");
const { expect } = require("chai");

test('auth succeeds', async () => {
    const { _ , publicSignals } = await snarkjs.plonk.fullProve(
      {
        captchaCodeHash: "0x6d46b72ff56458eaecce4bd88876de9e"
      }, "./circuits/auth.wasm", "./circuits/auth.zkey");

    expect(parseInt(publicSignals[0])).to.eq(1)
});

test('auth fails', async () => {
  const { _, publicSignals } = await snarkjs.plonk.fullProve({
    captchaCodeHash: "0x01234567890abcdef"
  }, "./circuits/auth.wasm", "./circuits/auth.zkey");

  expect(parseInt(publicSignals[0])).to.eq(0)
});