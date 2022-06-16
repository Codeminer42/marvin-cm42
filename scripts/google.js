// Commands using google tools, such as reading email or calendar
//
// Commands:
//   !brownbagnext - the next schedule stream
//   !brownbagprev - the last streamed video
//   !calendar - List upcoming events
//   !egggead - fetch egghead token from your-email@example.com
//   !streamyard - fetch streamyard code from your-email@example.com
//   !youtube - show the 3 upcoming streams schedule on youtube
//   !youtubeall - show up to 100 upcoming streams schedule on youtube
const retrieveCalendar = require('../lib/google/retrieveCalendar')
const youtube = require('../lib/google/youtube')
const retrieveEmail = require('../lib/google/retrieveEmail')
const { DateTime } = require('luxon')
const { isAllowedStreamYardUser, preventUrlExpansion, getDayName, getNextStreamDateAvailable } = require('../lib/utils')

module.exports = (robot) => {
  const locale = 'pt-br'

  robot.hear(/!calendar\b/, res => {
    retrieveCalendar
      .getEventsList()
      .then(events => {
        return events.map(event => {
          return [
            '',
            `> ${getDayName(event.date, locale)}`,
            `> **${event.title}**`,
            `> _${event.date.toLocaleString(DateTime.DATETIME_MED)}_`,
            event.description
              ? preventUrlExpansion(event.description).replace(/^/gm, '> ')
              : null
          ]
        })
      })
      .then(events => events.reduce((acc, item) => acc.concat(item), [])) // flatten
      .then(events => events.filter(l => l !== null).join('\n'))
      .then(events => {
        if (events.length === 0) {
          return res.send([
            'Nada por aqui... Está tudo muito quieto.',
            'Não encontrei nada, infelizmente.'
          ])
        }

        res.send(events)
      })
      .catch((err) => {
        console.error(err)

        res.send([
          '⚠️ Ooops... ⚠️',
          'Parece que houve um desabamento nos túneis da mina onde eu busco as informações.',
          'Tente mais tarde depois que limparmos os entulhos. 👷 '
        ])
      })
  })

  robot.hear(/!egghead\b/, res => {
    const room = res.envelope.user.id
    retrieveEmail
      .getEggHeadEmail()
      .then(preventUrlExpansion)
      .then(email => {
        robot.messageRoom(room, email)
      })
      .catch(error => {
        robot.messageRoom(room, error.message)
      })
  })

  robot.hear(/!streamyard\b/, res => {
    const room = res.envelope.user.id

    if (!isAllowedStreamYardUser(room)) {
      return robot.messageRoom(room, "Sorry, you don't have permission to use StreamYard. 🚫")
    }

    retrieveEmail
      .getStreamYardEmail()
      .then(preventUrlExpansion)
      .then(email => {
        robot.messageRoom(room, email)
      })
      .catch(error => {
        robot.messageRoom(room, error.message)
      })
  })

  robot.hear(/!youtube\b/, res => {
    youtube
      .getStreams({ max: 3, status: 'upcoming' })
      .then((streams) => streams.map((stream) => {
        const date = DateTime.fromISO(stream.snippet.scheduledStartTime, { locale, zone: 'America/Sao_Paulo' })
        const dateStr = date.toLocaleString(DateTime.DATETIME_MED)

        return [
          '',
          `> **${stream.snippet.title}**`,
          `> _${dateStr}_`,
          `> <https://youtube.com/watch?v=${stream.id}>`
        ]
      }))
      .then(streams => streams.reduce((acc, item) => acc.concat(item), [])) // flatten
      .then(streams => streams.filter(l => l !== null))
      .then(streams => {
        if (streams.length === 0) {
          return ['**NOTHING SCHEDULED YET! 📺**', '<https://youtube.com/Codeminer42TV>']
        }

        return ['**UPCOMING LIVE STREAMS 📺**', '<https://youtube.com/Codeminer42TV>', ...streams]
      })
      .then(streams => streams.join('\n'))
      .then(streams => res.send(streams))
      .catch(error => res.send(error.message))
  })

  robot.hear(/!youtubeall\b/, res => {
    youtube
      .getStreams({ max: 100, status: 'upcoming' })
      .then((streams) => streams.map((stream) => {
        const date = DateTime.fromISO(stream.snippet.scheduledStartTime, { locale, zone: 'America/Sao_Paulo' })
        const dateStr = date.toLocaleString(DateTime.DATETIME_MED)

        return ` - _${dateStr}_, **${stream.snippet.title}**, <https://youtube.com/watch?v=${stream.id}>`
      }))
      .then(streams => {
        if (streams.length === 0) {
          return ['**NOTHING SCHEDULED YET! 📺**', '<https://youtube.com/Codeminer42TV>']
        }

        return ['**ALL UPCOMING LIVE STREAMS 📺**', '<https://youtube.com/Codeminer42TV>', '', ...streams]
      })
      .then(streams => streams.join('\n'))
      .then(streams => res.send(streams))
      .catch(error => res.send(error.message))
  })

  robot.hear(/!brownbagprev\b/, res => {
    youtube
      .getStreams({ max: 1, status: 'completed' })
      .then((streams) => streams.map((stream) => {
        const date = DateTime.fromISO(stream.snippet.scheduledStartTime, { locale, zone: 'America/Sao_Paulo' })
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
      }))
      .then(streams => streams.reduce((acc, item) => acc.concat(item), [])) // flatten
      .then(streams => streams.filter(l => l !== null))
      .then(streams => streams.join('\n'))
      .then(streams => res.send(streams))
      .catch(error => res.send(error.message))
  })

  robot.hear(/!brownbagnext\b/, res => {
    youtube
      .getStreams({ max: 1, status: 'upcoming' })
      .then((streams) => streams.map((stream) => {
        const date = DateTime.fromISO(stream.snippet.scheduledStartTime, { locale, zone: 'America/Sao_Paulo' })
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
      }))
      .then(streams => streams.reduce((acc, item) => acc.concat(item), [])) // flatten
      .then(streams => streams.filter(l => l !== null))
      .then(streams => {
        if (streams.length === 0) {
          return ['**NOTHING SCHEDULED YET! 📺**', '<https://youtube.com/Codeminer42TV>']
        }

        return streams
      })
      .then(streams => streams.join('\n'))
      .then(streams => res.send(streams))
      .catch(error => res.send(error.message))
  })

  robot.hear(/!brownbagfree\b/, res => {
    youtube
      .getStreams({ max: 10, status: 'upcoming' })
      .then(streams => streams.map(stream => stream.snippet.scheduledStartTime))
      .then(streamsDates => getNextStreamDateAvailable(streamsDates))
      .then(streamDate => [
        'We have a free brownbag slot for:',
        streamDate.toLocaleString(DateTime.DATETIME_MED)
      ])
      .then(messages => messages.join('\n'))
      .then(message => res.send(message))
      .catch(error => res.send(error.message))
  })
}
