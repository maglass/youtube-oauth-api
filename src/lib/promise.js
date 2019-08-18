const request = require('request')

module.exports.requestPromise = (options) => new Promise((resolve, reject) => {
  request(options, (error, response, body) => {
    if (error) reject(error)
    resolve({ response, body })
  })
})


