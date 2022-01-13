const { CALENDAR_ID } = require('../config')
const { DateTime } = require('luxon')
const { authenticate } = require('./authenticate')
const { google } = require('googleapis')

const getCalendarEvents = async () => {
  const auth = authenticate('gmail')
  const calendar = google.calendar({
    version: 'v3',
    auth
  })

  var actualTimeString = DateTime.local().setZone('America/Sao_Paulo').toISO()

  const events = await calendar.events.list({
    calendarId: CALENDAR_ID,
    timeMin: actualTimeString,
    showDeleted: true
  })

  return events.data.items
}

module.exports = { getCalendarEvents }
