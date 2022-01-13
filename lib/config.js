require('dotenv').config()

module.exports = {
  CLIENT_ID: process.env.GMAIL_CLIENT_ID,
  CLIENT_SECRET: process.env.GMAIL_CLIENT_SECRET,
  REDIRECT_URIS: process.env.GMAIL_REDIRECT_URIS,
  token: {
    gmail: {
      access_token: process.env.GMAIL_ACCESS_TOKEN,
      refresh_token: process.env.GMAIL_REFRESH_TOKEN
    },
    youtube: {
      access_token: process.env.YOUTUBE_ACCESS_TOKEN,
      refresh_token: process.env.YOUTUBE_REFRESH_TOKEN
    },
    scope: process.env.GMAIL_SCOPE,
    token_type: process.env.GMAIL_TOKEN_TYPE,
    expiry_date: process.env.GMAIL_EXPIRY_DATE
  },
  CALENDAR_ID: process.env.CALENDAR_ID,
  CALENDAR_MAX_RESULTS: process.env.CALENDAR_MAX_RESULTS
}
