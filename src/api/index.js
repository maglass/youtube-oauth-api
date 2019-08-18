const Router = require('koa-router')
const request = require('request')
const queryString = require('query-string')

const { Client } = require('pg')

const {
  API_HOST,

  GOOGLE_OAUTH2_ENDPOINT,
  GOOGLE_OAUTH2_ENDPOINT_GET_TOKEN,
  GOOGLE_OAUTH2_CLIENT_ID,
  GOOGLE_OAUTH2_CLIENT_SECRET,
} = process.env

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

const requestPromise = (options) => new Promise((resolve, reject) => {
  request(options, (error, response, body) => {
    if (error) reject(error)
    resolve({ response, body })
  })
})

const router = new Router();

router.get('/', async (ctx) => {
  // Youtube Data APIv3 ever
  const scopes = [
    'https://www.googleapis.com/auth/youtube',
    'https://www.googleapis.com/auth/youtube.force-ssl',
    'https://www.googleapis.com/auth/youtube.readonly',
    'https://www.googleapis.com/auth/youtube.upload',
    'https://www.googleapis.com/auth/youtubepartner',
    'https://www.googleapis.com/auth/youtubepartner-channel-audit',
  ]
  const qs = queryString.stringify({
    redirect_uri: `${API_HOST}/callback`,
    scope: scopes.join(' '),
    client_id: GOOGLE_OAUTH2_CLIENT_ID,
    response_type: 'code',
    access_type: 'offline'
  })
  ctx.redirect(`${GOOGLE_OAUTH2_ENDPOINT}?${qs}`)
})


router.get('/callback', async (ctx) => {
  const params = ctx.request.query

  const options = {
    method: 'POST',
    url: GOOGLE_OAUTH2_ENDPOINT_GET_TOKEN,
    headers: {
      Host: 'www.googleapis.com',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    form: {
      code: params.code,
      client_id: GOOGLE_OAUTH2_CLIENT_ID,
      client_secret: GOOGLE_OAUTH2_CLIENT_SECRET,
      redirect_uri: `${API_HOST}/callback`,
      grant_type: 'authorization_code',
    },
  }
  try {
    const { body } = await requestPromise(options)
    const bodyJSON = JSON.parse(body)
    if (bodyJSON.error) {
      ctx.body = bodyJSON
      return
    }


    const sql = `
      INSERT INTO
        oauth_tokens(
          idx, scope, access_token, refresh_token, token_type, expires_in, created_at, updated_at
        )
      VALUES (
        nextval('sequence_oauth_tokens_idx'),
        $1,
        $2,
        $3,
        $4,
        $5,
        current_timestamp,
        current_timestamp
      )
    `
    client.connect()
    console.log(bodyJSON)
    const queryResult = await client.queryPromise(sql, [bodyJSON.scope, bodyJSON.access_token, '', bodyJSON.token_type, bodyJSON.expires_in])
    client.end()

    if (queryResult.rowCount !== 1) {
      ctx.body = {
        error: 'database Error',
      }
      return
    }
    ctx.body = body
  } catch (e) {
    console.log(e)
    client.end()
    ctx.body = {
      error: e,
    }
  }
})

module.exports = router
