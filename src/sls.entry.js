const Server = require('./server')
const serverlessHttp = require('serverless-http')

const server = new Server()

module.exports.ssr = (event, context, cb) => serverlessHttp(server.app)(event, context, cb)
