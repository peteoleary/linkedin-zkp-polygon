
const CircomCompiler = require('./circom_compiler')
const deploy = require('./deploy')

class ZKProof {
    constructor (name) {
        this._name = name
        this._cc = new CircomCompiler(name)
    }

    async makeAll() {
        await this._cc.compile_circuit(true)
        await this._cc.generate_witness()
        await this._cc.create_zkey()
        await this._cc.create_proof()
        await this._cc.create_contract()
        return Promise.resolve()
    }

    async deployContract() {
        deploy(this._cc.get_contract_name())
    }
}

module.exports = ZKProof