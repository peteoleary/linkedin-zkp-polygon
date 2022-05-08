
const CircomCompiler = require('./circom_compiler')
const deploy = require('./deploy')
const compile = require('./compile')
const Handlebars = require('handlebars')
const fs = require('fs')

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

class ZKProof {
    constructor (base, name) {
        name = name.replace(/[\.\@]/g, '_').replace('__', '_')
        this._base = base
        this._name = name
        this._cc = new CircomCompiler(this.makeCircuitName())
    }

    name() {
        return this._name
    }

    contract_name() {
        return this._cc.get_contract_name()
    }

    resolveTemplate(template_name, vars) {
        var template_text = fs.readFileSync(`circuits/${template_name}.template`, 'utf8')
      
        var template = Handlebars.compile(template_text);
        return template(vars)
      }
      
    makeCircuitName() {
        return `${this._base}_${this._name}`
      }
      
    async makeCircuit (vars) {
        const resolvedCircuit = this.resolveTemplate(`${this._base}.circom`, vars)
        
        const circuit_path = `circuits/${this.makeCircuitName()}.circom`
        fs.writeFileSync(circuit_path, resolvedCircuit, 'utf8')

        const json_path = `circuits/${this.makeCircuitName()}.json`
        fs.writeFileSync(json_path, JSON.stringify(vars), 'utf8')

        return circuit_path 
    }

    async makeAll() {
        await this._cc.compile_circuit(true)
        await this._cc.generate_witness()
        await this._cc.create_zkey()
        await this._cc.create_proof()
        await this._cc.create_contract()
        return Promise.resolve()
    }

    async compileContract() {
        compile(this._cc.get_contract_name())
        return Promise.resolve()
    }

    async deployContract() {
        deploy(this._cc.get_contract_name())
        return Promise.resolve()
    }

    async callContract() {

        // TODO: pull all the hardhat specific code together from here, deploy.js and compile.js
        const hre = require("hardhat");
        const {ethers, deployments, getNamedAccounts} = hre;

        const network = await ethers.provider.getNetwork();

        if (network.name == 'unknown') {
            await deployments.fixture([this._cc.get_contract_name()]);
        }

        const {verifier, _} = await getNamedAccounts();
            
        const loan_verifier = await ethers.getContract(this._cc.get_contract_name(), verifier);

        const { proof, publicSignals } = await snarkjs.groth16.fullProve({income: 300000, nonce: '0x1234567890abcdef'}, "./circuits/loan.wasm", "./circuits/loan.zkey")
        // from https://githubhot.com/repo/iden3/snarkjs/issues/112
        const [a, b, c, i] = groth16ExportSolidityCallData(unstringifyBigInts(proof), unstringifyBigInts(publicSignals))

        const output = await loan_verifier.verifyProof(a, b, c, i);

        console.log(output)
    }
}

module.exports = ZKProof