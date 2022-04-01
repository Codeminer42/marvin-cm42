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
  const upcomingSevenDays = DateTime.local().setZone('America/Sao_Paulo').plus({ week: 1 }).toISO()

  const events = await calendar.events.list({
    calendarId: CALENDAR_ID,
    timeMin: currentDay,
    timeMax: upcomingSevenDays,
    singleEvents: true,
    showDeleted: true
  })

  return events.data.items
}

module.exports = { getCalendarEvents }
