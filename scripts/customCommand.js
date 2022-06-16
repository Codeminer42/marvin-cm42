// Commands:
//    hubot add command <key> <value> - Add custom command to reply something
//    hubot delete command <key> - Delete custom command
//    !list - Returns a list with dynamic created commands
//    !<command> - Returns custom command value

const preDefinedCommands = [
  'alessandro',
  'almoso',
  'brownbag',
  'brownbagnext',
  'brownbagprev',
  'brownbagfree',
  'calendar',
  'egghead',
  'excuses',
  'godead',
  'list',
  'streamyard',
  'tallyson',
  'test',
  'youtube',
  'youtubeall'
]

const ADD_CMD_RE = /add command (\w+) (.*)/
const DEL_CMD_RE = /delete command (\w+)/
const LST_CMD_RE = /!list/i
const RED_CMD_RE = /(?<=^|\s)!(\w+)\b(.*)/i

const addFixedArguments = args => ({
  ...args,
  timestamp: Math.floor(Date.now() / 1000)
})

const getArguments = str =>
  str
    .split(',')
    .filter(arg => arg.includes('='))
    .map(it => it.split('='))
    .reduce((args, [key, val]) => ({ ...args, [key.trim()]: val.trim() }), {})

const replaceWithArguments = (str, args) => {
  const allArgs = addFixedArguments(args)

  return Object.keys(allArgs).reduce(
    (acc, argName) => acc.replace(`<${argName}>`, allArgs[argName]),
    str
  )
}

const addCommandFunction = robot => msg => {
  const [, command, responseValue] = msg.match

  robot.brain.set(command.toLowerCase(), responseValue)
  msg.send(
    `You've added the command *!${command}* with this reply: ${responseValue}`
  )
}

const deleteCommandFunction = robot => msg => {
  const [, command] = msg.match

  robot.brain.remove(command.toLowerCase())
  msg.send(`You've deleted the command *!${command}*`)
}

const listCommandsFunction = robot => msg => {
  const keys = Object.keys(robot.brain.data._private)
  const room = msg.envelope.user.id
  const listCommands = keys.map(key => `*!${key}*`)

  robot.messageRoom(
    room,
    'Here you can see a list of commands created by our users:\n' +
      listCommands.join('\n')
  )
}

const readCommandFunction = robot => msg => {
  const askFor = msg.match[1].trim()
  const argumentsValues = getArguments(msg.match[2])

  if (preDefinedCommands.includes(askFor)) {
    return
  }

  const response = robot.brain.get(askFor)

  if (response) {
    msg.send(replaceWithArguments(response, argumentsValues))
  } else {
    msg.send(
      'Hey, I haven\'t found anything, but you can add using: `marvin add command <key> "val"`'
    )
  }
}

module.exports = robot => {
  robot.respond(ADD_CMD_RE, addCommandFunction(robot))
  robot.respond(DEL_CMD_RE, deleteCommandFunction(robot))
  robot.hear(LST_CMD_RE, listCommandsFunction(robot))
  robot.hear(RED_CMD_RE, readCommandFunction(robot))
}
