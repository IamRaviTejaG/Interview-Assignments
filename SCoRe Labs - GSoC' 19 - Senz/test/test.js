/* eslint-disable no-unused-expressions */
/* eslint-env mocha */

/* eslint-disable */
import { server } from '../app'
/* eslint-enable */

let chai = require('chai')
let expect = chai.expect
let openpgp = require('openpgp')
let rp = require('request-promise')

const testUrl = `http://localhost:4000`

let serverPubKey

describe('Testing Routes', () => {
  it('Route: /serverpgpkey', done => {
    let options = {
      method: 'GET',
      url: testUrl + '/serverpgpkey'
    }
    rp(options).then(response => {
      serverPubKey = response
      expect(response.substr(0, 10)).to.deep.equal(`-----BEGIN`)
      done()
    }).catch(err => {
      done(err)
    })
  })

  it('Route: /postdata', async () => {
    let msgOptions = {
      message: openpgp.message.fromText('Hello There!'),
      publicKeys: (await openpgp.key.readArmored(serverPubKey)).keys,
      password: 'test-password'
    }
    let encryptedText = await openpgp.encrypt(msgOptions)

    let options = {
      method: 'POST',
      url: testUrl + '/postdata',
      body: {
        encryptedData: encryptedText,
        filename: 'testing.txt'
      },
      json: true
    }

    rp(options).then(response => {
      expect(response.message).to.deep.equal(`Success!`)
    })
  })
})
