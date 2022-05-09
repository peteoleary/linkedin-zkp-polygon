const crypto = require('crypto')
const ZKProof = require('../../zk_proofs')

async function handler(req, res) {
  const zkp = new ZKProof('auth', req.body.email)
  const results = await zkp.deployContract()
  return res.status(200).json(results)
}
  
module.exports = handler