const Server = require('./server')
const serverlessHttp = require('serverless-http')

const server = new Server()

module.exports.api = (event, context, cb) => serverlessHttp(server.app)(event, context, cb)
