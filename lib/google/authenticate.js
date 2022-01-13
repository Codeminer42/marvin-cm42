const { CLIENT_ID, CLIENT_SECRET, token } = require('../config')
const { google } = require('googleapis')

const authenticate = (platform = 'gmail') => {
  const oAuth2Client = new google.auth.OAuth2(
    {
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET
    }
  )

  // eslint-disable-next-line camelcase
  const { token_type, scope, expiry_date } = token

  oAuth2Client.setCredentials({ token_type, scope, expiry_date, ...token[platform] })
  return oAuth2Client
}

module.exports = { authenticate }
