import { authenticate } from '../config/middleware'
import { publicRouteHandler } from '../controllers/publicRouteController'
import { protectedRouteHandler } from '../controllers/protectedRouteController'

export let routes = (router) => {
  router.route('/login')
    .post(publicRouteHandler.login)

  router.route('/signup')
    .post(publicRouteHandler.signup)

  router.route('/jsonpatch')
    .patch(authenticate, protectedRouteHandler.jsonpatch)

  router.route('/thumbnail')
    .post(authenticate, protectedRouteHandler.genthumb)
}
