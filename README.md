# Zero Knowledge Proof Loan Application

## Description

This repo implements a very simple scheme where a "beneficiary" wants to prove their income meets a threshold set by a loan company who is the "verifier" of the information. The income information is provided by the "prover". This scheme attempts to yield as little information as possible in order to complete the business transaction.

Zero Knowledge Proof ("ZKP") examples (see the Credits section below) identify the "verifier" and "prover" in a ZKP transaction. However, in the context of a business transaction like a loan application the person initating the transaction, identified here as the "beneficiary", is the person who wants to complete the transaction to their benefit while disclosing as little information about themself as possible. In a loan application, the "prover" is a company which has income information about the "beneficiary" such as a payroll provider or corporation which issues W-2s or similar.

In this transaction the "beneficary" is the potential bad actor who could try to modify the income information to their advantage. The "verifier" therefore needs to establish a trust relationship with the "prover".

## Business terms

* The "verifier" sets the rules of the transaction. They express these rules in the circuit definition (".circom" file). In this example, the rule is that the "beneficiary" needs to make at least $200,000 per year.
* The "verifier" needs to trust the "prover" is a reliable source of information and that the information provided has not been altered. ZKP provides much of this trust as the files involved in the transaction described below are by definition highly tamper-resistant.
* In order to establish trust between the "verifier" and "prover" a nonce is provided by the "prover" to the "verifier" which can be verified in the circuit definition. In the transaction details described below, the "beneficiary" discloses to the "verifier" who will be the "verifier" and the "verifier" contacts the "prover" to retrieve the nonce for the transaction. The nonce can be any sufficiently large and random value as to prevent forgery.
* The goal of this transaction is provide only the information needed by the "verifier" to complete the transaction nothing more. In this case it is that the "beneficiary" income is greater than the threshold they need.
* An interesting feature of this transaction is that the "beneficiary" can see all of the data files shared between "prover" and "verifier" and can even verify the proof for themselves.

## Setup

```
yarn install
yarn circom:dev
yarn test
```

File definitions according to https://github.com/iden3/snarkjs#readme

Circom compiles circuits/loan.circom and circuits/loan.json in the following files:

circuits/loan.r1cs - the r1cs constraint system of the circuit in binary format
circuits/loan.wasm - the wasm code to generate the witness
circuits/loan.zkey - verification key for the circuit
circuits/loan.vkey.json - verification key (.zkey) in JSON format
contracts/LoanVerifier.sol - a Solidity contract which is a verifier for the proof

## Technical steps

Note in the steps below, we reference local files which are representative of the files which would need to be created individually by the "verifier" and "prover". This is done to hopefully make the process more clear. We also provide links to documentation which describes how to run each step via `circom` and `snarkjs` command line tools.

* The "beneficiary" initiates the transaction by contacting both the "verifier" and the "prover". This could be done via a Web form loan application hosted on the "verifier" site. The "prover" would be known in advance to the "verifier"
* The "verifier" contacts the "prover" to get the nonce for the transaction. This would be done via a secure channel and require disclosing some information to the "prover" that both parties already have. For example, a Social Security Number or Account Number provided by the "beneficiary".
* The "verifier" puts the nonce value and income income test into their circuit definition. In [circuits/loan.circom](circuits/loan.circom) the nonce value used is `0x1234567890abcdef` but it should be a much larger, randomized value. The income value in the example is 200000. <https://github.com/iden3/snarkjs#9-create-the-circuit>
* The "verifier" creates or selects a .ptau file for the transaction. This example uses a precomputed .ptau. The preparation of this file is outside the scope here. See <https://github.com/iden3/snarkjs#1-start-a-new-powers-of-tau-ceremony> for details about the Powers of Tau Ceremony.
* The "verifier" compiles the circuit yielding the files [circuit/loan.wasm](circuit/loan.wasm), [circuits/loan.r1cs](circuits/loan.r1cs) and [circuits/loan.zkey](circuits/loan.zkey). See <https://github.com/iden3/snarkjs#10-compile-the-circuit> on how to do this manually. See the file definitions above for more details of what are these files.
* The "verifier" provides [circuit/loan.wasm](circuit/loan.wasm) and [circuit/loan.zkey](circuit/loan.zkey) to "prover" via a secure channel.
* The "prover" use "beneficiary" income information and the nonce to create an `input.json` file similar to [circuits/loan.json](circuits/loan.json) then combines it with [circuit/loan.wasm](circuit/loan.wasm) to create [artifacts/circom/loan.wtns](artifacts/circom/loan.wtns). See <https://github.com/iden3/snarkjs#14-calculate-the-witness> for how to perform manually.
* The "prover" use [circuits/loan.zkey](circuits/loan.zkey) and [artifacts/circom/loan.wtns](artifacts/circom/loan.wtns) to generate the final proof. See <https://github.com/iden3/snarkjs#23-create-the-proof> for details.
* The "prover" sends to "verifier" the `proof.json` and `public.json` via some secure channel.
* The "verifier" can verify `proof.json` and `public.json`, see <https://github.com/iden3/snarkjs#24-verify-the-proof>
* Alternatively, "verifier" can write [contracts/LoanVerifier.sol](contracts/LoanVerifier.sol) to a compatible blockchain and in lieu of sending the proof files, "prover" can convert the proof into Solidity call data and call the contract. See [scripts/run_loan.js](scripts/run_loan.js) for example code.

## Credits

* https://github.com/0xPARC/circom-starter
* https://medium.com/coinmonks/zk-poker-a-simple-zk-snark-circuit-8ec8d0c5ee52
* https://github.com/enricobottazzi/ZKverse