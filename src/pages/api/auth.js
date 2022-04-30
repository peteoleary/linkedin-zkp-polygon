const Handlebars = require('handlebars')
const fs = require('fs')
const crypto = require('crypto')
const snarkjs = require('snarkjs')
const circom1Compiler = require("circom")

const resolveTemplate = (template_name, vars) => {
  // TODO: figure out relative path
  var template_text = fs.readFileSync(`circuits/${template_name}.template`, 'utf8')

  var template = Handlebars.compile(template_text);
  // execute the compiled template and print the output to the console
  return template(vars)
}

const makeFileName = (circuit_name, output_name, ext) => {
  return `circuits/${circuit_name}.${output_name}.${ext}`
}

const makeCircuit = async (circuit_name, output_name, vars) => {
  const resolvedCircuit = resolveTemplate(`${circuit_name}.circom`, vars)

  const circuit_file_name = makeFileName(circuit_name, output_name, 'circom')
  fs.writeFileSync(circuit_file_name, resolvedCircuit, 'utf8')
  
  const compile_result = await circom1Compiler.compiler(circuit_file_name, {
    watFileName: makeFileName(circuit_name, output_name, 'wat'),
    wasmFileName: makeFileName(circuit_name, output_name, 'wasm'),
    r1csFileName: makeFileName(circuit_name, output_name, 'r1cs'),
  })
  console.log(compile_result)
}

async function handler(req, res) {
  var hash = crypto.createHash('md5').update(req.body.captchaCode).digest('hex');
  await makeCircuit('auth', req.body.email, {captchaCodeHash: hash})
  return res.status(200).json({ captchaCodeHash: hash })
}
  
module.exports = handler