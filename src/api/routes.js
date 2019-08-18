const queryString = require('query-string')
const DBClient = require('model/db')
const { requestPromise } = require('lib/promise')

const {
  API_HOST,

  GOOGLE_OAUTH2_ENDPOINT,
  GOOGLE_OAUTH2_ENDPOINT_GET_TOKEN,
  GOOGLE_OAUTH2_CLIENT_ID,
  GOOGLE_OAUTH2_CLIENT_SECRET,
} = process.env

const SCOPES = [
  'https://www.googleapis.com/auth/youtube',
  'https://www.googleapis.com/auth/youtube.force-ssl',
  'https://www.googleapis.com/auth/youtube.readonly',
  'https://www.googleapis.com/auth/youtube.upload',
  'https://www.googleapis.com/auth/youtubepartner',
  'https://www.googleapis.com/auth/youtubepartner-channel-audit',
]

const redirectGoogleAuthentication = async (ctx) => {
  const qs = queryString.stringify({
    redirect_uri: `${API_HOST}/callback`,
    scope: SCOPES.join(' '),
    client_id: GOOGLE_OAUTH2_CLIENT_ID,
    response_type: 'code',
    prompt: 'consent',
    access_type: 'offline'
  })
  ctx.redirect(`${GOOGLE_OAUTH2_ENDPOINT}?${qs}`)
}


const getTokensFromGoogleOAuth = async (ctx) => {
  const client = new DBClient()

  try {
    const { query } = ctx.request
    const options = {
      method: 'POST',
      url: GOOGLE_OAUTH2_ENDPOINT_GET_TOKEN,
      headers: {
        Host: 'www.googleapis.com',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      form: {
        code: query.code,
        client_id: GOOGLE_OAUTH2_CLIENT_ID,
        client_secret: GOOGLE_OAUTH2_CLIENT_SECRET,
        redirect_uri: `${API_HOST}/callback`,
        grant_type: 'authorization_code',
      },
    }
    console.log(options)

    const { body } = await requestPromise(options)
    const bodyJSON = JSON.parse(body)
    console.log(bodyJSON)

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
    const queryResult = await client.queryPromise(sql, [bodyJSON.scope, bodyJSON.access_token, bodyJSON.refresh_token, bodyJSON.token_type, bodyJSON.expires_in])

    if (queryResult.rowCount !== 1) {
      ctx.body = {
        error: 'database Error',
      }
      return
    }
    ctx.body = body
  } catch (e) {
    console.log(e)
    ctx.body = {
      error: JSON.stringify(JSON.parse(e)),
    }
  } finally {
    client.end()
  }
}

const refreshAccessToken = async (ctx) => {
  const client = new DBClient()
  try {
    const { query } = ctx.request

    const checkSql = `
      SELECT
        *
      FROM
        oauth_tokens
      WHERE
        access_token = $1
    `

    const selectQueryResult = await client.queryPromise(checkSql, [query.access_token])

    if (!selectQueryResult.rows[0] || !selectQueryResult.rows[0].refresh_token) {
      ctx.body = { error: `doesn't exist refresh_key about this [${query.access_token}]` }
      return
    }
    const { idx, refresh_token } = selectQueryResult.rows[0]

    const options = {
      method: 'POST',
      url: GOOGLE_OAUTH2_ENDPOINT_GET_TOKEN,
      headers: {
        Host: 'www.googleapis.com',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      form: {
        client_id: GOOGLE_OAUTH2_CLIENT_ID,
        client_secret: GOOGLE_OAUTH2_CLIENT_SECRET,
        refresh_token,
        grant_type: 'refresh_token',
      },
    }

    const { body } = await requestPromise(options)
    const bodyJSON = JSON.parse(body)
    console.log(bodyJSON)

    const updateSql = `
      UPDATE
        oauth_tokens
      SET
        access_token = $1,
        expires_in = $2,
        scope = $3,
        token_type = $4,
        updated_at = current_timestamp
      WHERE
        idx = $5
    `

    const updateQueryResult = await client.queryPromise(updateSql, [bodyJSON.access_token, bodyJSON.expires_in, bodyJSON.scope, bodyJSON.token_type, idx])
    if (updateQueryResult.rowCount !== 1) {
      ctx.body = { error: 'database error has occured' }
    }

    ctx.body = body
  } catch (e) {
    console.log(e)
    ctx.body = {
      error: JSON.stringify(JSON.parse(e)),
    }
  } finally {
    client.end()
  }
}

module.exports = {
  redirectGoogleAuthentication,
  getTokensFromGoogleOAuth,
  refreshAccessToken,
}