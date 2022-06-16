const URL_RE = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/g
const INTERVAL_BETWEEN_STREAMS = 7

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
  const lastStreamDate = streamDates[streamDates.length - 1]

  for (let i = 0; i < streamDates.length - 1; i++) {
    const currentDate = streamDates[i]

    if (currentDate.equals(lastStreamDate)) {
      break
    }

    const nextDate = streamDates[i + 1]
    const dateInterval = nextDate.diff(currentDate, 'days').toObject().days

    if (dateInterval > INTERVAL_BETWEEN_STREAMS) {
      return currentDate.plus({ days: INTERVAL_BETWEEN_STREAMS })
    }
  }

  return lastStreamDate.plus({ days: INTERVAL_BETWEEN_STREAMS })
}

module.exports = { isAllowedStreamYardUser, preventUrlExpansion, getDayName, getNextStreamDateAvailable }
