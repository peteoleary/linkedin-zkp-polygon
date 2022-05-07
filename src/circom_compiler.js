const childProcess = require("child_process");
const fs = require('fs')
const snarkjs = require('snarkjs')
var _ = require('lodash');

/**
 * @param {string} command A shell command to execute
 * @return {Promise<string>} A promise that resolve to the output of the shell command, or an error
 * @example const output = await execute("ls -alh");
 */
function execute(command) {
  /**
   * @param {Function} resolve A function that resolves the promise
   * @param {Function} reject A function that fails the promise
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
   */
  return new Promise(function(resolve, reject) {
    /**
     * @param {Error} error An error triggered during the execution of the childProcess.exec command
     * @param {string|Buffer} standardOutput The result of the shell command execution
     * @param {string|Buffer} standardError The error resulting of the shell command execution
     * @see https://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback
     */
    console.log(command)
    childProcess.exec(command, function(error, standardOutput, standardError) {
      if (error) {
        reject(error.message);

        return;
      }

      if (standardError) {
        reject(standardError);

        return;
      }

      resolve(standardOutput);
    });
  });
}

class CircomCompiler {

  constructor (name) {
      this._name = name
  }

   async compile_circuit(overwrite = false)  {
      const cir_dir = this.get_circuit_directory()

      // one of the all time great SO threads https://stackoverflow.com/questions/13696148/node-js-create-folder-or-use-existing
      // there is an inverse correlation between how many lines of code there are in an answer and the number of comments on it
      if (fs.existsSync(cir_dir)) {
        if (!overwrite) {
          throw `${cir_dir} already exists`
        }
      }
      else {
        fs.mkdirSync(cir_dir);
      }
      
      // TODO: parse stdout and turn it into useful information
      return execute(`circom ${cir_dir}.circom --r1cs --wasm --sym -o ${cir_dir}`)
    }

    async generate_witness(circuit_name) {
      const js_dir = this.get_js_directory(this._name)
      const wc  = require(`../${js_dir}/witness_calculator.js`);

      const input = this.get_input_json(this._name)
      
      const buffer = fs.readFileSync(this.get_wasm_file_name(this._name));
      wc(buffer).then(async witnessCalculator => {
      //    const w= await witnessCalculator.calculateWitness(input,0);
      //    for (let i=0; i< w.length; i++){
      //	console.log(w[i]);
      //    }
      const buff= await witnessCalculator.calculateWTNSBin(input,0);
      fs.writeFileSync(`${js_dir}/${this._name}.wtns`, buff, function(err) {
          if (err) throw err;
      });
        });
    }

    async create_zkey()  {
      await snarkjs.plonk.setup(`${this.get_circuit_directory()}/${this._name}.r1cs`, 'circuits/pot15_final.ptau', this.get_zkey_name(this._name))
    }


    async create_proof()  {
      //snarkjs plonk setup circuit.r1cs pot12_final.ptau circuit_final.zkey
      const input = this.get_input_json(this._name)
      const { proof , publicSignals } = await snarkjs.plonk.fullProve(
        input, this.get_wasm_file_name(this._name), this.get_zkey_name(this._name));
        fs.writeFileSync(`${this.get_circuit_directory()}/${this._name}.proof`, JSON.stringify(proof))
    }

    get_contract_name() {
      return `${_.upperFirst(_.camelCase(this._name))}Verifier`
    }

    get_contract_file() {
      return `contracts/${this.get_contract_name()}.sol`
    }

    async create_contract()  {
      var result = await snarkjs.zKey.exportSolidityVerifier(this.get_zkey_name(this._name), {plonk: fs.readFileSync('node_modules/snarkjs/templates/verifier_plonk.sol.ejs').toString()})
      
      result = result.replace('PlonkVerifier', this.get_contract_name(this._name))

      fs.writeFileSync(this.get_contract_file(this._name), result)
    }

    get_circuit_directory() {
      return `circuits/${this._name}`
    }
    
    get_js_directory() {
      return `${this.get_circuit_directory()}/${this._name}_js`
    }
    
    get_input_json() {
      return JSON.parse(fs.readFileSync(this.get_circuit_directory() + '.json', "utf8"));  // json
    }
    
    get_wasm_file_name() {
      return `${this.get_js_directory(this._name)}/${this._name}.wasm`
    }
    
    get_zkey_name() {
      return `${this.get_circuit_directory()}/${this._name}.zkey`
    }
}

module.exports = CircomCompiler