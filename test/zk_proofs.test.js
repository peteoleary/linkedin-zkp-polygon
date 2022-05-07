const { expect } = require('chai');
const  fs  = require('fs');
const { eq } = require('lodash');
const { hasUncaughtExceptionCaptureCallback } = require('process');
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
        await new ZKProof('auth', 'pete@timelight.com').makeAll()
        expect(fs.existsSync('circuits/auth_pete_timelight_com')).to.equal(true)
        expect(fs.existsSync('circuits/auth_pete_timelight_com/auth_pete_timelight_com.zkey')).to.equal(true)
        expect(fs.existsSync('contracts/AuthPeteTimelightComVerifier.sol')).to.equal(true)
    }, 30000)

    test('compiles contract',  async () => {
        await new ZKProof('auth', 'pete@timelight.com').compileContract()
        expect(fs.existsSync('artifacts/contracts/AuthPeteTimelightComVerifier.sol/AuthPeteTimelightComVerifier.json')).to.equal(true)
    }, 30000)
    
    test('deploys contract',  async () => {
        return await new ZKProof('auth', 'pete@timelight.com').deployContract()
    }, 30000)
});