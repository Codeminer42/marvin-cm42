// const { DateTime } = require('luxon')
const { authenticate } = require('./authenticate')
const { google } = require('googleapis')

const getStreams = async ({ max = 5, status = 'upcoming' } = {}) => {
  const auth = authenticate('youtube')
  const youtube = google.youtube({ version: 'v3', auth })

  const streams = await youtube.liveBroadcasts.list({
    broadcastStatus: status,
    maxResults: max,
    part: 'id,snippet,contentDetails,status'
  })

  return streams.data.items || []
}

module.exports = { getStreams }
