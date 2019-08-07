const Koa = require('koa')
const Router = require('koa-router')

class Server {
  constructor() {
    this.app = new Koa()
    this.router = new Router()
    this.middleware()
  }

  middleware() {
    const { app, router } = this

    app.use(router.routes())
    app.use(router.allowedMethods())
  }

  listen(port) {
    const { app } = this
    app.listen(port)
    console.log('Listening to port', port)
  }
}

module.exports = Server
