const atob = require('atob')
const { authenticate } = require('./authenticate')
const { google } = require('googleapis')

const EGGHEAD_FROM = 'support@egghead.io'
const STREAMYARD_FROM = 'yourfriends@streamyard.com'

const markEmailAsRead = (gmailClient, threadId) => {
  try {
    gmailClient.users.threads.modify({
      userId: 'me',
      id: threadId,
      requestBody: {
        removeLabelIds: ['UNREAD']
      }
    })
  } catch (error) {
    console.log(error)
  }
}

const getEmail = async ({ from }) => {
  const auth = authenticate('gmail')
  const gmailClient = google.gmail({ version: 'v1', auth })
  const messageList = await gmailClient.users.messages.list({
    userId: 'me',
    q: `from:${from};is:unread`
  })

  if (!messageList.data.messages) {
    return null
  }

  const eggHeadEmail = await gmailClient.users.messages.get({
    userId: 'me',
    id: messageList.data.messages[0].id
  })

  markEmailAsRead(gmailClient, messageList.data.messages[0].threadId)

  return atob(eggHeadEmail.data.payload.parts[0].body.data)
}

const getEggHeadEmail = async () => {
  const message = await getEmail({ from: EGGHEAD_FROM })

  if (message === null) {
    return `**There are no unread Egghead emails!**
    \n⚠️ Please, try to log in again, and check in a minute.
    \n📒 Follow the instructions: https://gitlab.com/codeminer-42/codeminer42/-/wikis/learning-resources
    \n🔗 Sign In: https://egghead.io/login`
  }

  return message
}

const getStreamYardEmail = async () => {
  const message = await getEmail({ from: STREAMYARD_FROM })

  if (message === null) {
    return [
      '**There are no unread StreamYard emails!**\n',
      'You might want to login through https://streamyard.com/login',
      `Fill \`${process.env.STREAMYARD_USER_EMAIL}\` in the \`E-mail\` field and try again to get the login code.`
    ].join('\n')
  }

  return message
}

module.exports = { getEggHeadEmail, getStreamYardEmail }
