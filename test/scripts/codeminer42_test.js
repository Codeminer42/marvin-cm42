const Helper = require('hubot-test-helper')
const co = require('co')
const expect = require('chai').expect
const sinon = require('sinon')

const helper = new Helper('../../scripts/codeminer42.js')
const sandbox = sinon.sandbox.create()

describe('codeminer42', () => {
  beforeEach(() => {
    this.room = helper.createRoom()
  })

  afterEach(() => {
    this.room.destroy()
    sandbox.restore()
  })

  describe('!almoso', () => {
    beforeEach(() => {
      return co(function * () {
        yield this.room.user.say('user1', '!almoso')
      }.bind(this))
    })

    it('sends the correct picture', () => {
      expect(this.room.messages).to.eql([
        ['user1', '!almoso'],
        ['hubot', 'http://i.imgur.com/gTviOgc.jpg']
      ])
    })
  })

  context('!english', () => {
    beforeEach(() => {
      return co(function * () {
        yield this.room.user.say('user1', '!english')
      }.bind(this))
    })

    it('sends the english video link', () => {
      expect(this.room.messages).to.eql([
        ['user1', '!english'],
        ['hubot', 'https://www.youtube.com/watch?v=a0x6vIAtFcI']
      ])
    })
  })

  context('!test', () => {
    const content = [
      'Exemplo1: <https://exemplo.com/test1>',
      'Exemplo2: <https://exemplo.com/test2>'
    ].join('\n')

    beforeEach(() => {
      process.env.TEST_LINKS = content

      return co(function * () {
        yield this.room.user.say('user1', '!test')
      }.bind(this))
    })

    it('sends all the test links', () => {
      expect(this.room.messages).to.eql([
        ['user1', '!test'],
        ['hubot', content]
      ])
    })
  })

  context('!brownbag', () => {
    const content = [
      '**CM42 Brown Bags**: _quintas-feiras das 12:30 às 13:00_ no YouTube :tv: (<https://youtube.com/Codeminer42TV>).',
      ':calendar: Confira a última ou a próxima brownbag com os comandos `!brownbagprev` e `!brownbagnext`',
      '',
      '**Quer apresentar?**',
      '- Preencha o formulário em <https://forms.gle/dPBDuQzi3gVTfuXbA> e leia todas as informações.',
      '- O tempo máximo é de **30 minutos**.',
      '- Agendamento, dúvidas, etc, é só falar com `@paulodiovani`.',
      '',
      'Não é necessário preparação ou slides, apenas vontade de compartilhar algo com os colegas.'
    ].join('\n')

    beforeEach(() => {
      return co(function * () {
        yield this.room.user.say('user1', '!brownbag')
      }.bind(this))
    })

    it('sends the brownbag info', () => {
      expect(this.room.messages).to.eql([
        ['user1', '!brownbag'],
        ['hubot', content]
      ])
    })
  })

  context('!excuses', () => {
    beforeEach(() => {
      sandbox.stub(this.room.robot, 'http').returns({
        get: () => (cb) => cb(null, null, '(not so) random excuse')
      })
    })

    afterEach(() => {
      sandbox.restore()
    })

    beforeEach(() => {
      return co(function * () {
        yield this.room.user.say('user1', '!excuses')
      }.bind(this))
    })

    it('sends a programming excuse', () => {
      expect(this.room.messages).to.eql([
        ['user1', '!excuses'],
        ['hubot', '(not so) random excuse']
      ])
    })
  })

  describe('!alessandro', () => {
    beforeEach(() => {
      return co(function * () {
        yield this.room.user.say('user1', '!alessandro')
      }.bind(this))
    })

    it('sends the correct picture', () => {
      expect(this.room.messages).to.eql([
        ['user1', '!alessandro'],
        ['hubot', 'http://res.cloudinary.com/paulodiovani/image/upload/v1528308466/alessandro_lumaqm.jpg']
      ])
    })
  })

  describe('!godead', () => {
    beforeEach(() => {
      return co(function * () {
        yield this.room.user.say('user1', '!godead')
      }.bind(this))
    })

    it('sends the correct picture', () => {
      expect(this.room.messages).to.eql([
        ['user1', '!godead'],
        ['hubot', 'https://res.cloudinary.com/dgjml2eyw/image/upload/v1545308158/godead.png']
      ])
    })
  })

  describe('!talysson', () => {
    const content = [
      "It's time to duel",
      'https://res.cloudinary.com/dgjml2eyw/image/upload/v1545316115/taly.png'
    ].join('\n')

    beforeEach(() => {
      return co(function * () {
        yield this.room.user.say('user1', '!talysson')
      }.bind(this))
    })

    it('sends the correct picture', () => {
      expect(this.room.messages).to.eql([
        ['user1', '!talysson'],
        ['hubot', content]
      ])
    })
  })
})
