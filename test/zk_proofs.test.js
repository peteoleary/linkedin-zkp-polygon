const zkp = require('../src/zk_proofs')

describe("zk proofs instance", function () {
    test('compiles circuits programatically',  async () => {
        return await new zkp('loan').makeAll()
    }, 30000)
    
    test('deploys proof',  async () => {
        return await new zkp('loan').deployContract()
    }, 30000)
});