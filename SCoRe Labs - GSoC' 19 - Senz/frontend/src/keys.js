import fs from 'fs'

let keys = {
  clientPubKey: () => {
    fs.readFileSync('../keys/client.public.pem', (err, data) => {
      if (err) {
        console.log(err)
      } else {
        console.log(data)
        return data
      }
    })
  },

  clientPrivKey: () => {
    fs.readFileSync('../keys/client.private.pem', (err, data) => {
      if (err) {
        console.log(err)
      } else {
        return data
      }
    })
  },

  serverPubKey: () => {
    fs.readFileSync('../keys/server.public.pem', (err, data) => {
      if (err) {
        console.log(err)
      } else {
        return data
      }
    })
  }
}

export default keys
