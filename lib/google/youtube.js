const { authenticate } = require('./authenticate')
const { google } = require('googleapis')

const getStreamsData = async ({ max = 5, status = 'upcoming', pageToken = '' } = {}) => {
  const auth = authenticate('youtube')
  const youtube = google.youtube({ version: 'v3', auth })

  const streams = await youtube.liveBroadcasts.list({
    broadcastStatus: status,
    maxResults: max,
    part: 'id,snippet,contentDetails,status',
    pageToken
  })

  return streams.data || {}
}

const getStreams = async ({ max = 5, status = 'upcoming', pageToken = '' } = {}) => {
  const streamsData = await getStreamsData({ max, status, pageToken })

  return streamsData.items || []
}

const getLastStream = async ({ max = 1, status = 'upcoming', pageToken = '' } = {}) => {
  const streams = await getStreamsData({ max, status, pageToken })

  if (streams.nextPageToken) {
    const nextPageStreams = await getLastStream({ max, status, pageToken: streams?.nextPageToken })
    return nextPageStreams || []
  } else {
    return streams.items || []
  }
}

module.exports = { getStreams, getLastStream }
