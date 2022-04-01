const WEEK_DAYS = ['DOMINGO', 'SEGUNDA-FEIRA', 'TERÇA-FEIRA', 'QUARTA-FEIRA', 'QUINTA-FEIRA', 'SEXTA-FEIRA', 'SÁBADO']
const URL_RE = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/g

const isAllowedStreamYardUser = (userId) => {
  const allowedUsers = process.env.ALLOWED_STREAMYARD_USERS ? process.env.ALLOWED_STREAMYARD_USERS.split(',') : []
  return allowedUsers.includes(userId.toString())
}

const preventUrlExpansion = (message) => message.replace(URL_RE, '<$&>')

const getDayName = (dateTime) => {
  const date = new Date(dateTime)
  return WEEK_DAYS[date.getDay()]
}

module.exports = { isAllowedStreamYardUser, preventUrlExpansion, getDayName }
