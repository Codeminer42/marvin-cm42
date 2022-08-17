const chai = require('chai')
const sinonChai = require('sinon-chai')
const { getEmail } = require('../../../lib/google/retrieveEmail')
const { createSandbox } = require('sinon')
const { google } = require('googleapis')

const { expect } = chai

chai.use(sinonChai)
const sandbox = createSandbox()

describe('/lib/retrieveEmail', () => {
  let clientMock
  let gmailMock

  beforeEach(() => {
    clientMock = sandbox.createStubInstance(google.auth.OAuth2)
    sandbox.stub(google.auth, 'OAuth2').returns(clientMock)

    const messagesMock = {
      data: {
        messages: [{
          threadId: 999,
          data: {
            id: 999,
            payload: {
              parts: [{
                body: { data: 'Zm9vYmFy' }
              }]
            }
          }
        }]
      }
    };

    gmailMock = {
      users: {
        messages: {
          list: sandbox.stub().resolves(messagesMock),
          get: sandbox.stub().resolves(messagesMock.data.messages[0])
        },
        threads: {
          modify: sandbox.stub()
        }
      }
    }

    sandbox.stub(google, 'gmail').returns(gmailMock)
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('.getEmail', () => {
    context('when there are emails', () => {
      it('read and return the first message', async () => {
        const email = await getEmail({ from: 'foobar@example.com' })

        expect(email).to.eq('foobar')
      })
    })

    context('when there are no emails', () => {
      it('returns null', async () => {
        gmailMock.users.messages.list.resolves({ data: { messages: null } })

        const email = await getEmail({ from: 'foobar@example.com' })

        expect(email).to.eq(null)
      })
    })
  })
})

