const chai = require('chai')
const sinonChai = require('sinon-chai')
const { authenticate } = require('../../lib/google/authenticate')
const { createSandbox } = require('sinon')
const { google } = require('googleapis')

const { expect } = chai

chai.use(sinonChai)
const sandbox = createSandbox()

describe('/lib/authenticate', () => {
  let clientMock

  beforeEach(() => {
    clientMock = sandbox.createStubInstance(google.auth.OAuth2)
    sandbox.stub(google.auth, 'OAuth2').returns(clientMock)
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('.authenticate', () => {
    context('when platform is not provided', () => {
      it('authenticate user with google and returns client', () => {
        const client = authenticate()

        expect(client).to.eq(clientMock)
        expect(clientMock.setCredentials).to.have.been.calledWith(sandbox.match.object)
      })
    })
  })
})
