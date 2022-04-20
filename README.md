# Blah

## Steps to create

yarn install
yarn circom:dev
yarn test

File definitions according to https://github.com/iden3/snarkjs#readme

Creates the following files:

circuits/loan.r1cs - the r1cs constraint system of the circuit in binary format
circuits/loan.wasm - the wasm code to generate the witness
circuits/loan.zkey - verification key for the circuit
circuits/loan.vkey.json - verification key (.zkey) in JSON format
contracts/LoanVerifier.sol

`generate the witness here`  - need the wasm file and input.json

`generate the proof here` - need the witness and zkey

# Credits

https://github.com/0xPARC/circom-starter
https://medium.com/coinmonks/zk-poker-a-simple-zk-snark-circuit-8ec8d0c5ee52
https://github.com/enricobottazzi/ZKverse