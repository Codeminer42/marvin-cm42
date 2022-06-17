const { DateTime } = require('luxon')

const URL_RE = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/g
const INTERVAL_BETWEEN_STREAMS_IN_DAYS = 7
const STREAM_WEEK_DAY = 4
const STREAM_TIME_HOUR = 12
const STREAM_TIME_MINUTES = 30

const isAllowedStreamYardUser = (userId) => {
  const allowedUsers = process.env.ALLOWED_STREAMYARD_USERS ? process.env.ALLOWED_STREAMYARD_USERS.split(',') : []
  return allowedUsers.includes(userId.toString())
}

const preventUrlExpansion = (message) => message.replace(URL_RE, '<$&>')

const getDayName = (dateTime, locale = 'pt-br') => {
  const date = new Date(dateTime)
  return date.toLocaleDateString(locale, { weekday: 'long' }).toUpperCase()
}

const getNextStreamDateAvailable = (streamDates) => {
  if (streamDates.length === 0) {
    return getClosestStreamDate(DateTime.now())
  }

  const lastStreamDate = streamDates[streamDates.length - 1]

  for (let i = 0; i < streamDates.length - 1; i++) {
    const currentDate = streamDates[i]
    const nextDate = streamDates[i + 1]

    const dateInterval = nextDate.diff(currentDate, 'days').toObject().days

    if (dateInterval > INTERVAL_BETWEEN_STREAMS_IN_DAYS) {
      return currentDate.plus({ days: INTERVAL_BETWEEN_STREAMS_IN_DAYS })
    }
  }

  return lastStreamDate.plus({ days: INTERVAL_BETWEEN_STREAMS_IN_DAYS })
}

const getClosestStreamDate = date => {
  if (date.weekday !== STREAM_WEEK_DAY) {
    return getClosestStreamDate(date.plus({ days: 1 }))
  }
  return date.set({ hours: STREAM_TIME_HOUR, minutes: STREAM_TIME_MINUTES })
}

module.exports = { isAllowedStreamYardUser, preventUrlExpansion, getDayName, getNextStreamDateAvailable }
