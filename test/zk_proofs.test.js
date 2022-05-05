const { expect } = require('chai');
const { eq } = require('lodash');
const ZKProof = require('../src/zk_proofs')

describe("zk proofs instance", function () {

    test('regularizes circuit name',  async () => {
        const z =  await new ZKProof('auth', 'pete@timelight.com')
        expect(z.name()).to.eq('pete_timelight_com')
        expect(z.contract_name()).to.eq('AuthPeteTimelightComVerifier')
    }, 30000)

    test('makes a circuit',  async () => {
        const circuit_path =  await new ZKProof('auth', 'pete@timelight.com').makeCircuit({captchaCodeHash: '0x123456789abcdef'})
        expect(circuit_path).to.eq('circuits/auth_pete_timelight_com.circom')
    }, 30000)

    test('compiles circuits programatically',  async () => {
        return await new ZKProof('auth', 'pete@timelight.com').makeAll()
    }, 30000)

    test('compiles proof',  async () => {
        return await new ZKProof('auth', 'pete@timelight.com').compileContract()
    }, 30000)
    
    test('deploys proof',  async () => {
        return await new ZKProof('auth', 'pete@timelight.com').deployContract()
    }, 30000)
});