import { dbConnection } from './database'
let bcrypt = require('bcrypt')
let jwt = require('jsonwebtoken')
let userSchema = require('../schema/userSchema')
let UserModel = dbConnection.model('user', userSchema)

export let auth = {
  /**
   * Returns if the JWT token is valid
   * @param token
   */
  authorize: token => {
    return new Promise((resolve, reject) => {
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          reject(err)
        } else {
          resolve(decoded)
        }
      })
    })
  },

  /**
   * Returns a JWT token with the given payload
   * @param payload
   */
  generateToken: payload => {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' })
  },

  /**
   * Handles the login requests
   * @param req
   * @param res
   */
  login: (req, res) => {
    if (req.body.username && req.body.password) {
      if (req.body.username.trim().length > 2) {
        UserModel.findOne({ username: req.body.username }).exec().then(data => {
          if (data) {
            bcrypt.compare(req.body.password, data.password).then(result => {
              if (!result) {
                res.status(200).json({ message: 'Incorrect credentials!' })
              } else {
                let token = auth.generateToken({ username: data.username })
                res.status(200).json({ message: 'Login successful!', token })
              }
            })
          } else {
            res.status(200).json({ message: 'Username doesn\'t exist in the database!' })
          }
        })
      } else {
        res.status(200).json({ message: 'Username should be atleast 3 characters long!' })
      }
    } else {
      res.status(200).json({ message: 'Bad request!' })
    }
  },

  /**
   * Handles user registration requests
   * @param req
   * @param res
   */
  register: (req, res) => {
    if (req.body.username && req.body.password) {
      if (req.body.username.trim().length > 2) {
        UserModel.find({ username: req.body.username }).exec().then(data => {
          if (!data.length) {
            bcrypt.hash(req.body.password, parseInt(process.env.SALT_ROUNDS)).then(passhash => {
              let userData = new UserModel({
                username: req.body.username,
                password: passhash
              })
              userData.save().then(result => {
                let token = auth.generateToken({ username: req.body.username })
                res.status(200).json({ message: 'Signup successful!', token })
              })
            })
          } else {
            res.status(200).json({ message: 'Username already taken!' })
          }
        })
      } else {
        res.status(200).json({ message: 'Username should be atleast 3 characters long!' })
      }
    } else {
      res.status(200).json({ message: 'Bad request!' })
    }
  }
}
