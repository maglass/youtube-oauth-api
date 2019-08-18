
const { Client } = require('pg')

const {
  DATASOURCE_PG_HOST,
  DATASOURCE_PG_PORT,
  DATASOURCE_PG_USERNAME,
  DATASOURCE_PG_PASSWORD,
  DATASOURCE_PG_DATABASE,
} = process.env

class DBClient extends Client{
  constructor() {
    super({
      user: DATASOURCE_PG_USERNAME,
      host: DATASOURCE_PG_HOST,
      database: DATASOURCE_PG_DATABASE,
      password: DATASOURCE_PG_PASSWORD,
      port: DATASOURCE_PG_PORT,
    })
    this.connect()
  }

  queryPromise(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.query(sql, params, (err, res) => {
        if (err) reject(err)
        resolve(res)
      })
    })
  }
}

module.exports = DBClient