import React, { Component } from 'react'
import axios from 'axios'
import * as openpgp from 'openpgp'
import './App.css'
import done from './done.png'
import load from './load.gif'

let clientKeyObj

let genKeyPairOptions = {
  userIds: [{ name:'client' }],
  curve: `ed25519`,
  passphrase: 'client-password'
}
openpgp.generateKey(genKeyPairOptions).then(key => {
  clientKeyObj = key
  console.log(key.publicKeyArmored)
})

class App extends Component {
  fileRead = event => {
    let fileObject = event.target.files[0]
    document.getElementById('filename').innerHTML = `Selected file: ${fileObject.name}`
    if ((fileObject.size / 1048576) > 30) {
      document.getElementById('uploadStatus').innerHTML = `File size too large (> 30 MB)`
      document.getElementById('done').style.visibility = `hidden`
      document.getElementById('loading').style.visibility = `hidden`
      document.getElementById('uploadStatus').style.color = `red`
    } else {
      if (fileObject.type.substr(0, fileObject.type.indexOf('/')) !== 'audio') {
        document.getElementById('uploadStatus').innerHTML = `Selected file is not an audio file`
        document.getElementById('done').style.visibility = `hidden`
        document.getElementById('loading').style.visibility = `hidden`
        document.getElementById('uploadStatus').style.color = `red`
      } else {
        document.getElementById('uploadStatus').innerHTML = `Reading file`
        document.getElementById('done').style.visibility = `hidden`
        document.getElementById('loading').style.visibility = `visible`
        document.getElementById('uploadStatus').style.color = `blue`
        let reader = new FileReader()
        let filename = fileObject.name
        reader.readAsArrayBuffer(fileObject)
        reader.onloadend = e => {
          this.fileEncrypt(filename, reader.result)
        }
      }
    }
  }

  fileEncrypt = async (fileName, content) => {
    document.getElementById('uploadStatus').innerHTML = `Encrypting file contents`
    document.getElementById('done').style.visibility = `hidden`
    document.getElementById('loading').style.visibility = `visible`
    document.getElementById('uploadStatus').style.color = `orange`
    let uint8Content = new Uint8Array(content)
    let privKeyObj = clientKeyObj.privateKeyArmored
    let serverPgpReq = await axios.get('http://localhost:4000/serverpgpkey')
    let options = {
      message: openpgp.message.fromBinary(uint8Content),
      publicKeys: (await openpgp.key.readArmored(serverPgpReq.data)).keys,
      privatekeys: privKeyObj
    }
    openpgp.encrypt(options).then(ciphertext => {
      this.sendData(fileName, ciphertext)
    }).catch(err => {
      console.log(err)
    })
  }

  sendData = (fileName, encryptedData) => {
    document.getElementById('uploadStatus').innerHTML = `Sending content across!`
    document.getElementById('loading').style.visibility = `visible`
    let options = { encryptedData: encryptedData, filename: fileName }
    axios.post('http://localhost:4000/postdata', options).then(res => {
      document.getElementById('uploadStatus').innerHTML = `Upload successful!`
      document.getElementById('loading').style.visibility = `hidden`
      document.getElementById('done').style.visibility = `visible`
      document.getElementById('uploadStatus').style.color = `green`
    }).catch(err => {
      document.getElementById('uploadStatus').innerHTML = `Upload failed! Please try again.`
      document.getElementById('uploadStatus').style.color = `red`
      console.log(`Data sending failed! ${err}`)
    })
  }

  render() {
    return (
      <div className="App">
        <input
          style={{display: 'none'}}
          type='file'
          onChange={this.fileRead}
          ref={fileIn => this.fileIn = fileIn}
        />
        <button onClick={() => this.fileIn.click()}>Select a file to upload</button>
        <p id='filename'></p>
        <p id='uploadStatus' style={{display: 'inline-block'}}></p>
        <img id='loading' alt='working' src={load}></img>
        <img id='done' alt='done' src={done}></img>
      </div>
    );
  }
}

export default App;
