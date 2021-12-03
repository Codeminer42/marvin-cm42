const { DateTime } = require('luxon')

const URL_RE = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/g

const isAllowedStreamYardUser = (userId) => {
  const allowedUsers = process.env.ALLOWED_STREAMYARD_USERS ? process.env.ALLOWED_STREAMYARD_USERS.split(',') : []
  return allowedUsers.includes(userId.toString())
}

const preventUrlExpansion = (message) => message.replace(URL_RE, '<$&>')

const getDayName = (dateTime, locale = 'pt-br') => {
  const date = new Date(dateTime)
  return date.toLocaleDateString(locale, { weekday: 'long' }).toUpperCase()
}

const brownBagMessageList = (stream = null) => {
  if (!stream) return []

  const date = DateTime.fromISO(stream.snippet.scheduledStartTime, { locale: 'pt-br', zone: 'America/Sao_Paulo' })
  const dateStr = date.toLocaleString(DateTime.DATETIME_MED)

  return [
    `**${stream.snippet.title}**`,
    `_${dateStr}_`,
    `https://youtube.com/watch?v=${stream.id}`,
    '',
    stream.snippet.description
      ? preventUrlExpansion(stream.snippet.description).replace(/\r/gm, '').replace(/^/gm, '> ')
      : null
  ]
}

module.exports = { isAllowedStreamYardUser, preventUrlExpansion, getDayName, brownBagMessageList }
