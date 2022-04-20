This is a starter template for [Learn Next.js](https://nextjs.org/learn).

Credits:

https://github.com/0xPARC/circom-starter
https://medium.com/coinmonks/zk-poker-a-simple-zk-snark-circuit-8ec8d0c5ee52
https://github.com/enricobottazzi/ZKverse

# Steps to create

`yarn circom:dev`

File definitions according to https://github.com/iden3/snarkjs#readme

Creates the following files:

circuits/poker.r1cs - the r1cs constraint system of the circuit in binary format
circuits/poker.wasm - the wasm code to generate the witness
circuits/poker.zkey - verification key for the circuit
circuits/poker.vkey.json - verification key (.zkey) in JSON format
contracts/PokerVerifier.sol

`generate the witness here`  - need the wasm file and input.json

`generate the proof here` - need the witness and zkey