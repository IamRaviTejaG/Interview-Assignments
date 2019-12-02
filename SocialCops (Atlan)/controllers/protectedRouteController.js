let axios = require('axios')
let fs = require('fs')
let jsonpatch = require('fast-json-patch')
let sharp = require('sharp')

export let protectedRouteHandler = {
  /**
   * Handles jsonpatch requests
   * @param req
   * @param res
   */
  jsonpatch: (req, res) => {
    if (req.body.obj && req.body.patch) {
      let bodyObj = req.body.obj
      let patchObj = req.body.patch
      let finalDoc = jsonpatch.applyPatch(bodyObj, patchObj).newDocument
      res.status(200).json(finalDoc)
    } else {
      res.status(200).json({ message: 'Invalid body/patch object!' })
    }
  },

  /**
   * Handles thumbnail requests & generates a 50x50 image thumbnail
   * @param req
   * @param res
   */
  genthumb: (req, res) => {
    if (req.body.url) {
      const timeNow = (Math.floor(new Date() / 1000)).toString()
      let imageName = timeNow + req.body.url.substr(-4)

      const dlFunc = (imageUrl, imageFileName, callback) => {
        axios({ 'url': imageUrl, 'responseType': 'stream' }).then(response => {
          response.data.pipe(fs.createWriteStream(imageFileName)).on('close', callback)
        }).catch(err => {
          res.status(200).json({ message: 'Invalid URL!', error: err.toString() })
        })
      }

      dlFunc(req.body.url, imageName, () => {
        let imageNameResized = timeNow + '_resized.png'
        /* eslint-disable */
        fs.readFile(imageName, (err, data) => {
        /* eslint-enable */
          sharp(data).resize(50, 50).toFile(imageNameResized).then(() => {
            res.status(200).json({ message: 'Thumbnail saved!' })
          })
        })
      })
    } else {
      res.status(200).json({ message: 'URL field unavailable!' })
    }
  }
}
