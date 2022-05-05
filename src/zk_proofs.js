
const CircomCompiler = require('./circom_compiler')
const {compile, deploy} = require('./deploy')
const Handlebars = require('handlebars')
const fs = require('fs')

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
}

module.exports = ZKProof