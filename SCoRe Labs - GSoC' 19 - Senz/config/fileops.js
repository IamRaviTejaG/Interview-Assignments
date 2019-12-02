let fs = require('fs')
let openpgp = require('openpgp')
let path = require('path')

openpgp.initWorker({ path: 'compat/openpgp.worker.js' })

export let fileOps = {
  /**
   * Handles PGP message decryption and writes the decrypted file
   * @param filename
   * @param encryptedText
   */
  decryptData: async (filename, encryptedText) => {
    let serverPrivKey = fs.readFileSync(path.resolve(__dirname, '../keys/', 'server.private'), { flag: 'r' })
    let passphrase = `server-password`
    serverPrivKey = (await openpgp.key.readArmored(serverPrivKey)).keys[0]
    await serverPrivKey.decrypt(passphrase)
    const options = {
      message: await openpgp.message.readArmored(encryptedText),
      privateKeys: serverPrivKey,
      format: 'binary'
    }
    openpgp.decrypt(options).then(decrypted => {
      fs.writeFileSync(filename, decrypted.data, { flag: 'w' })
    }).catch(err => {
      console.log(err)
    })
  },

  /**
   * Handles PGP message decryption and writes the decrypted file
   * @param req
   * @param res
   */
  getServerPgpKey: (req, res) => {
    let content = fs.readFileSync(path.resolve(__dirname, '../keys/', 'server.public'), { flag: 'r' })
    res.status(200).send(content)
  },

  postDataHandler: (req, res) => {
    let encryptedText = req.body.encryptedData.data
    let filename = req.body.filename
    fileOps.decryptData(filename, encryptedText)
    res.status(200).json({ message: `Success!` })
  }
}
