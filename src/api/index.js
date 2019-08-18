const Router = require('koa-router')
const routes = require('./routes')

const router = new Router();

router.get('/', routes.redirectGoogleAuthentication)
router.get('/callback', routes.getTokensFromGoogleOAuth)
router.get('/refresh', routes.refreshAccessToken)
module.exports = router
