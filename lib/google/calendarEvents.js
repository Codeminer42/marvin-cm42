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

  const currentDay = DateTime.local().setZone('America/Sao_Paulo').toISO()
  const endOfTheCurrentWeek = DateTime.local().setZone('America/Sao_Paulo').endOf('week').toISO()

  const events = await calendar.events.list({
    calendarId: CALENDAR_ID,
    timeMin: currentDay,
    timeMax: endOfTheCurrentWeek,
    singleEvents: true,
    showDeleted: true
  })

  return events.data.items
}

module.exports = { getCalendarEvents }
