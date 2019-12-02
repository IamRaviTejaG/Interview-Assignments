import { auth } from './auth'

/**
 * Middleware for authenticating JWT tokens on protected routes
 * @param req
 * @param res
 * @param next
 */
export let authenticate = (req, res, next) => {
  let token = req.get('x-jwt-token')
  if (!token) {
    res.status(200).json({ error: 'JWT token missing!' })
  } else {
    auth.authorize(token).then(data => {
      next()
    }).catch(err => {
      res.status(200).json({ message: 'Bad request!', error: err })
    })
  }
}
