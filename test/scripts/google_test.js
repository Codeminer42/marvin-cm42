const Helper = require('hubot-test-helper')
const calendarEvents = require('../../lib/google/calendarEvents')
const chai = require('chai')
const co = require('co')
const retrieveEmail = require('../../lib/google/retrieveEmail')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const youtube = require('../../lib/google/youtube')

chai.use(sinonChai)
const { expect } = chai
const helper = new Helper('../../scripts/google.js')
const sandbox = sinon.sandbox.create()

describe('google', () => {
  beforeEach(() => {
    this.room = helper.createRoom()
  })

  afterEach(() => {
    this.room.destroy()
    sandbox.restore()
  })

  describe('!egghead', () => {
    let getEggHeadEmailStub
    const emailContent = [
      'You asked us to send you a login link for quickly signing into egghead.io.',
      '==> Click here to access your egghead.io account',
      '==> Or check on http://example.com/egghead'
    ].join('\n')

    const expectedMessage = [
      'You asked us to send you a login link for quickly signing into egghead.io.',
      '==> Click here to access your egghead.io account',
      '==> Or check on <http://example.com/egghead>'
    ].join('\n')

    beforeEach(() => {
      getEggHeadEmailStub = sandbox.stub(retrieveEmail, 'getEggHeadEmail')
    })

    context('when successfull email connection', () => {
      beforeEach(() => {
        getEggHeadEmailStub.resolves(emailContent)
        return co(
          function * () {
            yield this.room.user.say('user1', '!egghead')
            yield new Promise((resolve) => setTimeout(resolve, 1000))
          }.bind(this)
        )
      })

      it('sends the email response', () => {
        expect(this.room.messages).to.eql([
          ['user1', '!egghead']
        ])

        expect(this.room.robot.messagesTo.user1).to.eql([
          ['hubot', expectedMessage]
        ])
      })
    })

    context('when failed email connection', () => {
      beforeEach(() => {
        getEggHeadEmailStub.rejects(new Error('Error Message'))
        return co(
          function * () {
            yield this.room.user.say('user1', '!egghead')
            yield new Promise((resolve) => setTimeout(resolve, 1000))
          }.bind(this)
        )
      })

      it('recejcts with message', () => {
        expect(this.room.messages).to.eql([
          ['user1', '!egghead']
        ])

        expect(this.room.robot.messagesTo.user1).to.eql([
          ['hubot', 'Error Message']
        ])
      })
    })
  })

  describe('!streamyard', () => {
    let getStreamYardEmailStub
    const emailContent = [
      'You asked us to send you a login link for quickly signing into streamyard.com.',
      '==> Follow the link http://example.com/streamyard'
    ].join('\n')

    const expectedMessage = [
      'You asked us to send you a login link for quickly signing into streamyard.com.',
      '==> Follow the link <http://example.com/streamyard>'
    ].join('\n')

    beforeEach(() => {
      getStreamYardEmailStub = sandbox.stub(retrieveEmail, 'getStreamYardEmail')
    })

    context('when user is not allowed', () => {
      beforeEach(() => {
        process.env.ALLOWED_STREAMYARD_USERS = '123'
        return co(
          function * () {
            yield this.room.user.say('user1', '!streamyard')
            yield new Promise((resolve) => setTimeout(resolve, 1000))
          }.bind(this)
        )
      })

      it('notifies the user', () => {
        expect(this.room.messages).to.eql([
          ['user1', '!streamyard']
        ])

        expect(this.room.robot.messagesTo.user1).to.eql([
          ['hubot', "Sorry, you don't have permission to use StreamYard. 🚫"]
        ])
      })
    })

    context('when successfull email connection', () => {
      beforeEach(() => {
        process.env.ALLOWED_STREAMYARD_USERS = 'user1'
        getStreamYardEmailStub.resolves(emailContent)
        return co(
          function * () {
            yield this.room.user.say('user1', '!streamyard')
            yield new Promise((resolve) => setTimeout(resolve, 1000))
          }.bind(this)
        )
      })

      it('sends the email response', () => {
        expect(this.room.messages).to.eql([
          ['user1', '!streamyard']
        ])

        expect(this.room.robot.messagesTo.user1).to.eql([
          ['hubot', expectedMessage]
        ])
      })
    })

    context('when failed email connection', () => {
      beforeEach(() => {
        process.env.ALLOWED_STREAMYARD_USERS = 'user1'
        getStreamYardEmailStub.rejects(new Error('Error Message'))
        return co(
          function * () {
            yield this.room.user.say('user1', '!streamyard')
            yield new Promise((resolve) => setTimeout(resolve, 1000))
          }.bind(this)
        )
      })

      it('recejcts with message', () => {
        expect(this.room.messages).to.eql([
          ['user1', '!streamyard']
        ])

        expect(this.room.robot.messagesTo.user1).to.eql([
          ['hubot', 'Error Message']
        ])
      })
    })
  })

  describe('!calendar', () => {
    let userRoom

    beforeEach(() => {
      userRoom = helper.createRoom({ name: 'user1', httpd: false })
    })

    afterEach(() => {
      userRoom.destroy()
    })

    const message = [
      '',
      '> QUINTA-FEIRA',
      '> **chuva agora**',
      '> _28 de jan. de 2077 14:59_',
      '> <http://example.com/chuva>',
      '',
      '> SEXTA-FEIRA',
      '> **iih hoje é dia de beber mas so depois do trabalho**',
      '> _29 de jan. de 2077 17:00_',
      '',
      '> SÁBADO',
      '> **encerrando o expediente com uma opera**',
      '> _30 de jan. de 2077 17:00_'
    ].join('\n')

    const content = [
      {
        start: {
          dateTime: '2077-01-28T14:59:39-03:00'
        },
        summary: 'chuva agora',
        description: 'http://example.com/chuva'
      },
      {
        start: {
          dateTime: '2077-01-29T17:00:39-03:00'
        },
        summary: 'iih hoje é dia de beber mas so depois do trabalho'
      },
      {
        start: {
          dateTime: '2077-01-30T17:00:39-03:00'
        },
        summary: 'encerrando o expediente com uma opera'
      }
    ]

    context('when successful retrieve events', () => {
      beforeEach(() => {
        sandbox.stub(calendarEvents, 'getCalendarEvents').resolves(content)

        return co(
          function * () {
            yield this.room.user.say('user1', '!calendar')
            yield new Promise((resolve) => setTimeout(resolve, 1000))
          }.bind(this))
      })

      it('receives message in room', () => {
        expect(this.room.messages).to.eql([
          ['user1', '!calendar'],
          ['hubot', message]
        ])
      })
    })

    context('when fail to retrieve events', () => {
      const expected = [
        '⚠️ Ooops... ⚠️',
        'Parece que houve um desabamento nos túneis da mina onde eu busco as informações.',
        'Tente mais tarde depois que limparmos os entulhos. 👷 '
      ]

      beforeEach(() => {
        sandbox.stub(calendarEvents, 'getCalendarEvents').rejects(new Error('NOTHING HERE, JUST BUGS'))
        sandbox.stub(console, 'error') // cleanup test output

        return co(
          function * () {
            yield this.room.user.say('user1', '!calendar')
            yield new Promise((resolve) => setTimeout(resolve, 1000))
          }.bind(this))
      })

      it('get the error message', () => {
        expect(this.room.messages).to.eql([
          ['user1', '!calendar'],
          ['hubot', expected]
        ])
      })
    })

    context('when retrieve 0 events', () => {
      const noMessages = [
        'Nada por aqui... Está tudo muito quieto.',
        'Não encontrei nada, infelizmente.'
      ]

      beforeEach(() => {
        sandbox.stub(calendarEvents, 'getCalendarEvents').resolves([])

        return co(
          function * () {
            yield this.room.user.say('user1', '!calendar')
            yield new Promise((resolve) => setTimeout(resolve, 1000))
          }.bind(this))
      })

      it('get zero events message', () => {
        expect(this.room.messages).to.eql([
          ['user1', '!calendar'],
          ['hubot', noMessages]
        ])
      })
    })
  })

  const sharedExamplesForYoutubeError = (command, youtubeArgs = [], method = 'getStreams') => {
    context('when an error occurs', () => {
      beforeEach(() => {
        sandbox.stub(youtube, method).rejects(new Error('Some shit happened!'))

        return co(
          function * () {
            yield this.room.user.say('user1', command)
            yield new Promise((resolve) => setTimeout(resolve, 1000))
          }.bind(this))
      })

      it('receives a message and no list', () => {
        const message = 'Some shit happened!'

        expect(youtube[method]).to.have.been.calledWith(...youtubeArgs)
        expect(this.room.messages).to.eql([
          ['user1', command],
          ['hubot', message]
        ])
      })
    })
  }

  describe('!youtube', () => {
    context('when there are no errors', () => {
      let scheduledStreams = []

      beforeEach(() => {
        sandbox.stub(youtube, 'getStreams').resolves(scheduledStreams)

        return co(
          function * () {
            yield this.room.user.say('user1', '!youtube')
            yield new Promise((resolve) => setTimeout(resolve, 1000))
          }.bind(this))
      })

      context('when there are upcoming streams', () => {
        before(() => {
          scheduledStreams = [{
            id: 'some-video-id',
            snippet: {
              title: 'video title',
              description: 'video desc',
              scheduledStartTime: '2021-09-02T15:30:00Z'
            }
          }]
        })

        it('receives a list of streams', () => {
          const message = [
            '**UPCOMING LIVE STREAMS 📺**',
            '<https://youtube.com/Codeminer42TV>',
            '',
            '> **video title**',
            '> _2 de set. de 2021 12:30_',
            '> <https://youtube.com/watch?v=some-video-id>'
          ].join('\n')

          expect(youtube.getStreams).to.have.been.calledWith({ max: 3, status: 'upcoming' })
          expect(this.room.messages).to.eql([
            ['user1', '!youtube'],
            ['hubot', message]
          ])
        })
      })

      context('when there are not upcoming streams', () => {
        before(() => {
          scheduledStreams = []
        })

        it('receives a message and no list', () => {
          const message = [
            '**NOTHING SCHEDULED YET! 📺**',
            '<https://youtube.com/Codeminer42TV>'
          ].join('\n')

          expect(youtube.getStreams).to.have.been.calledWith({ max: 3, status: 'upcoming' })
          expect(this.room.messages).to.eql([
            ['user1', '!youtube'],
            ['hubot', message]
          ])
        })
      })
    })

    sharedExamplesForYoutubeError('!youtube', [{ max: 3, status: 'upcoming' }])
  })

  describe('!youtubeall', () => {
    context('when there are no errors', () => {
      let scheduledStreams = []

      beforeEach(() => {
        sandbox.stub(youtube, 'getStreams').resolves(scheduledStreams)

        return co(
          function * () {
            yield this.room.user.say('user1', '!youtubeall')
            yield new Promise((resolve) => setTimeout(resolve, 1000))
          }.bind(this))
      })

      context('when there are upcoming streams', () => {
        before(() => {
          scheduledStreams = [{
            id: 'some-video-id',
            snippet: {
              title: 'video title',
              description: 'video desc',
              scheduledStartTime: '2021-09-02T15:30:00Z'
            }
          }]
        })

        it('receives a list of up to 100 streams', () => {
          const message = [
            '**ALL UPCOMING LIVE STREAMS 📺**',
            '<https://youtube.com/Codeminer42TV>',
            '',
            ' - _2 de set. de 2021 12:30_, **video title**, <https://youtube.com/watch?v=some-video-id>'
          ].join('\n')

          expect(youtube.getStreams).to.have.been.calledWith({ max: 100, status: 'upcoming' })
          expect(this.room.messages).to.eql([
            ['user1', '!youtubeall'],
            ['hubot', message]
          ])
        })
      })

      context('when there are not upcoming streams', () => {
        before(() => {
          scheduledStreams = []
        })

        it('receives a message and no list', () => {
          const message = [
            '**NOTHING SCHEDULED YET! 📺**',
            '<https://youtube.com/Codeminer42TV>'
          ].join('\n')

          expect(youtube.getStreams).to.have.been.calledWith({ max: 100, status: 'upcoming' })
          expect(this.room.messages).to.eql([
            ['user1', '!youtubeall'],
            ['hubot', message]
          ])
        })
      })
    })

    sharedExamplesForYoutubeError('!youtubeall', [{ max: 100, status: 'upcoming' }])
  })

  describe('!brownbagprev', () => {
    context('when there are no errors', () => {
      const previousStreams = [{
        id: 'some-video-id',
        snippet: {
          title: 'video title',
          description: 'video desc',
          scheduledStartTime: '2021-09-02T15:30:00Z'
        }
      }]

      beforeEach(() => {
        sandbox.stub(youtube, 'getStreams').resolves(previousStreams)

        return co(
          function * () {
            yield this.room.user.say('user1', '!brownbagprev')
            yield new Promise((resolve) => setTimeout(resolve, 1000))
          }.bind(this))
      })

      it('answers with latest stream', () => {
        const message = [
          '**video title**',
          '_2 de set. de 2021 12:30_',
          'https://youtube.com/watch?v=some-video-id',
          '',
          '> video desc'
        ].join('\n')

        expect(youtube.getStreams).to.have.been.calledWith({ max: 1, status: 'completed' })
        expect(this.room.messages).to.eql([
          ['user1', '!brownbagprev'],
          ['hubot', message]
        ])
      })
    })

    sharedExamplesForYoutubeError('!brownbagprev', [{ max: 1, status: 'completed' }])
  })

  describe('!brownbagnext', () => {
    context('when there are no errors', () => {
      let scheduledStreams = []

      beforeEach(() => {
        sandbox.stub(youtube, 'getStreams').resolves(scheduledStreams)

        return co(
          function * () {
            yield this.room.user.say('user1', '!brownbagnext')
            yield new Promise((resolve) => setTimeout(resolve, 1000))
          }.bind(this))
      })

      context('when there are upcoming streams', () => {
        before(() => {
          scheduledStreams = [{
            id: 'some-video-id',
            snippet: {
              title: 'video title',
              description: 'video desc',
              scheduledStartTime: '2021-09-02T15:30:00Z'
            }
          }]
        })

        it('answers with the next schedule stream', () => {
          const message = [
            '**video title**',
            '_2 de set. de 2021 12:30_',
            'https://youtube.com/watch?v=some-video-id',
            '',
            '> video desc'
          ].join('\n')

          expect(youtube.getStreams).to.have.been.calledWith({ max: 1, status: 'upcoming' })
          expect(this.room.messages).to.eql([
            ['user1', '!brownbagnext'],
            ['hubot', message]
          ])
        })
      })

      context('when there are not upcoming streams', () => {
        before(() => {
          scheduledStreams = []
        })

        it('receives a message and no list', () => {
          const message = [
            '**NOTHING SCHEDULED YET! 📺**',
            '<https://youtube.com/Codeminer42TV>'
          ].join('\n')

          expect(youtube.getStreams).to.have.been.calledWith({ max: 1, status: 'upcoming' })
          expect(this.room.messages).to.eql([
            ['user1', '!brownbagnext'],
            ['hubot', message]
          ])
        })
      })
    })

    sharedExamplesForYoutubeError('!brownbagnext', [{ max: 1, status: 'upcoming' }])
  })
  describe('!brownbaglast', () => {
    context('when there are no errors', () => {
      let scheduledStreams = []

      beforeEach(() => {
        sandbox.stub(youtube, 'getLastStream').resolves(scheduledStreams)

        return co(
          function * () {
            yield this.room.user.say('user1', '!brownbaglast')
            yield new Promise((resolve) => setTimeout(resolve, 1000))
          }.bind(this))
      })

      context('when there are upcoming streams', () => {
        before(() => {
          scheduledStreams = {
            id: 'some-video-id',
            snippet: {
              title: 'video title',
              description: 'video desc',
              scheduledStartTime: '2021-09-02T15:30:00Z'
            }
          }
        })

        it('answers with the last schedule stream', () => {
          const message = [
            '**video title**',
            '_2 de set. de 2021 12:30_',
            'https://youtube.com/watch?v=some-video-id',
            '',
            '> video desc'
          ].join('\n')

          expect(youtube.getLastStream).to.have.been.calledWith({ max: 100, status: 'upcoming' })
          expect(this.room.messages).to.eql([
            ['user1', '!brownbaglast'],
            ['hubot', message]
          ])
        })
      })

      context('when there are not upcoming streams', () => {
        before(() => {
          scheduledStreams = null
        })

        it('receives a message and no list', () => {
          const message = [
            '**NOTHING SCHEDULED YET! 📺**',
            '<https://youtube.com/Codeminer42TV>'
          ].join('\n')

          expect(youtube.getLastStream).to.have.been.calledWith({ max: 100, status: 'upcoming' })
          expect(this.room.messages).to.eql([
            ['user1', '!brownbaglast'],
            ['hubot', message]
          ])
        })
      })
    })

    sharedExamplesForYoutubeError('!brownbaglast', [{ max: 100, status: 'upcoming' }], 'getLastStream')
  })
})
