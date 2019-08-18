
const { Client } = require('pg')

const {
  DATASOURCE_PG_HOST,
  DATASOURCE_PG_PORT,
  DATASOURCE_PG_USERNAME,
  DATASOURCE_PG_PASSWORD,
  DATASOURCE_PG_DATABASE,
} = process.env

const client = new Client({
  user: DATASOURCE_PG_USERNAME,
  host: DATASOURCE_PG_HOST,
  database: DATASOURCE_PG_DATABASE,
  password: DATASOURCE_PG_PASSWORD,
  port: DATASOURCE_PG_PORT,
})

client.queryPromise = (sql, params = []) => new Promise((resolve, reject) => {
  client.query(sql, params, (err, res) => {
    if (err) reject(err)
    resolve(res)
  })
})

module.exports = client