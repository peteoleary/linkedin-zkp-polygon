const childProcess = require("child_process");
const fs = require('fs')
const snarkjs = require('snarkjs')

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
    childProcess.exec(command, function(error, standardOutput, standardError) {
      if (error) {
        reject();

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

function get_circuit_directory(circuit_name) {
  return `circuits/${circuit_name}`
}

function get_js_directory(circuit_name) {
  return `${get_circuit_directory(circuit_name)}/${circuit_name}_js`
}

function get_input_json(circuit_name) {
  return JSON.parse(fs.readFileSync(get_circuit_directory(circuit_name) + '.json', "utf8"));  // json
}

function get_wasm_file_name(circuit_name) {
  return `${get_js_directory(circuit_name)}/${circuit_name}.wasm`
}

function get_zkey_name(circuit_name) {
  return `${get_circuit_directory(circuit_name)}/${circuit_name}.zkey`
}

const CircomCompiler = {

   async compile_circuit(circuit_name, overwrite = false)  {
      const cir_dir = get_circuit_directory(circuit_name)

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
    },
    async generate_witness(circuit_name) {
      const js_dir = get_js_directory(circuit_name)
      const wc  = require(`../${js_dir}/witness_calculator.js`);

      const input = get_input_json(circuit_name)
      
      const buffer = fs.readFileSync(get_wasm_file_name(circuit_name));
      wc(buffer).then(async witnessCalculator => {
      //    const w= await witnessCalculator.calculateWitness(input,0);
      //    for (let i=0; i< w.length; i++){
      //	console.log(w[i]);
      //    }
      const buff= await witnessCalculator.calculateWTNSBin(input,0);
      fs.writeFileSync(`${js_dir}/${circuit_name}.wtns`, buff, function(err) {
          if (err) throw err;
      });
        });
    },
    async create_zkey(circuit_name)  {
      await snarkjs.plonk.setup(`${get_circuit_directory(circuit_name)}/${circuit_name}.r1cs`, 'circuits/pot15_final.ptau', get_zkey_name(circuit_name))
    },

    async create_proof(circuit_name)  {
      //snarkjs plonk setup circuit.r1cs pot12_final.ptau circuit_final.zkey
      const input = get_input_json(circuit_name)
      const { proof , publicSignals } = await snarkjs.plonk.fullProve(
        input, get_wasm_file_name(circuit_name), get_zkey_name(circuit_name));
        fs.writeFileSync(`${get_circuit_directory(circuit_name)}/${circuit_name}.proof`, JSON.stringify(proof))
    },

    async create_contract(circuit_name)  {
      const result = await snarkjs.zKey.exportSolidityVerifier(get_zkey_name(circuit_name), {plonk: fs.readFileSync('node_modules/snarkjs/templates/verifier_plonk.sol.ejs').toString()})
      fs.writeFileSync(`${get_circuit_directory(circuit_name)}/${circuit_name}_verifier.sol`, result)
    }
}

module.exports = CircomCompiler