import { auth } from '../config/auth'

export let publicRouteHandler = {
  /**
   * Handles login requests & routes them further to auth.login
   * @param req
   * @param res
   */
  login: (req, res) => {
    auth.login(req, res)
  },

  /**
   * Handles signup requests & routes them further to auth.register
   * @param req
   * @param res
   */
  signup: (req, res) => {
    auth.register(req, res)
  }
}
