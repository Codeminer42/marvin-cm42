const getCalendarEvents = require('./calendarEvents')
const { DateTime } = require('luxon')

const getEventsList = async () => {
  const events = await getCalendarEvents.getCalendarEvents()

  return events
    .map(event => {
      const date = DateTime.fromISO(event.start.dateTime, { locale: 'pt-br', zone: 'America/Sao_Paulo' })

      if (event.status === 'cancelled') {
        return null
      }

      return {
        title: event.summary,
        description: event.description,
        date
      }
    })
    .filter(e => e !== null)
    .sort((a, b) => a.date.toMillis() - b.date.toMillis())
}

module.exports = { getEventsList }
