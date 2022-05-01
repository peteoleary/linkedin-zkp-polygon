const Handlebars = require('handlebars')
const fs = require('fs')
const crypto = require('crypto')
const cc = require("../../circom_compiler")

const resolveTemplate = (template_name, vars) => {
  // TODO: figure out relative path
  var template_text = fs.readFileSync(`circuits/${template_name}.template`, 'utf8')

  var template = Handlebars.compile(template_text);
  // execute the compiled template and print the output to the console
  return template(vars)
}

const makeCircuitName = (circuit_name, output_name) => {
  return `${circuit_name}.${output_name}`
}

const makeCircuit = async (input_circuit_name, output_name, vars) => {
  const resolvedCircuit = resolveTemplate(`${input_circuit_name}.circom`, vars)

  const circuit_name = makeCircuitName(input_circuit_name, output_name)
  fs.writeFileSync(`circuits/${circuit_name}.circom`, resolvedCircuit, 'utf8')
  
  cc.compile_circuit(circuit_name)
}

async function handler(req, res) {
  var hash = crypto.createHash('md5').update(req.body.captchaCode).digest('hex');
  await makeCircuit('auth', req.body.email, {captchaCodeHash: hash})
  return res.status(200).json({ captchaCodeHash: hash })
}
  
module.exports = handler