let fs = require('fs')
let openpgp = require('openpgp')
let path = require('path')

openpgp.initWorker({ path: 'compat/openpgp.worker.js' })

if (!fs.existsSync(path.resolve(__dirname, '../keys'))) {
  fs.mkdirSync(path.resolve(__dirname, '../keys'))
}

export let keys = {
  generateServerKeys: () => {
    let options = {
      userIds: [{ name: 'server' }],
      curve: 'ed25519',
      passphrase: 'server-password'
    }
    openpgp.generateKey(options).then(key => {
      fs.writeFileSync(path.resolve(__dirname, '../keys', 'server.private'), key.privateKeyArmored, { flag: 'w' })
      fs.writeFileSync(path.resolve(__dirname, '../keys', 'server.public'), key.publicKeyArmored, { flag: 'w' })
      fs.writeFileSync(path.resolve(__dirname, '../keys', 'server.revoke'), key.revocationCertificate, { flag: 'w' })
    })
  }
}
