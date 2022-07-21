const { expect } = require('chai')
const sinon = require('sinon')
const { google } = require('googleapis')
const { getLastStream } = require('../../../lib/google/youtube')

const sandbox = sinon.sandbox.create()

describe('/lib/google/youtube', () => {
  afterEach(function () {
    sandbox.restore()
  })

  describe('.getLastStream', () => {
    const listStub = sandbox.stub()

    beforeEach(function () {
      sandbox.stub(google, 'youtube').returns({
        liveBroadcasts: {
          list: listStub
        }
      })
    })

    context('when there are no next page', () => {
      beforeEach(function () {
        listStub.resolves({
          data: {
            items: [
              {
                id: 'some-video-id-1',
                snippet: {
                  title: 'video title 1',
                  description: 'video desc 1',
                  scheduledStartTime: '2021-09-02T15:30:00Z'
                }
              },
              {
                id: 'some-video-id-2',
                snippet: {
                  title: 'video title 2',
                  description: 'video desc 2',
                  scheduledStartTime: '2021-12-02T15:30:00Z'
                }
              }
            ]
          }
        })
      })

      it('resolves with the last stream', async () => {
        const stream = await getLastStream()
        expect(stream.id).to.equal('some-video-id-2')
      })
    })

    context('when there are next page', () => {
      beforeEach(function () {
        listStub.onCall(0).resolves({
          data: {
            nextPageToken: 'ABC12',
            items: [
              {
                id: 'some-video-id-1',
                snippet: {
                  title: 'video title 1',
                  description: 'video desc 1',
                  scheduledStartTime: '2021-09-02T15:30:00Z'
                }
              },
              {
                id: 'some-video-id-2',
                snippet: {
                  title: 'video title 2',
                  description: 'video desc 2',
                  scheduledStartTime: '2021-10-02T15:30:00Z'
                }
              }
            ]
          }
        })

        listStub.onCall(1).resolves({
          data: {
            items: [
              {
                id: 'some-video-id-3',
                snippet: {
                  title: 'video title 3',
                  description: 'video desc 3',
                  scheduledStartTime: '2021-11-02T15:30:00Z'
                }
              },
              {
                id: 'some-video-id-4',
                snippet: {
                  title: 'video title 4',
                  description: 'video desc 4',
                  scheduledStartTime: '2021-12-02T15:30:00Z'
                }
              }
            ]
          }
        })
      })

      it('resolves with the last stream from next page', async () => {
        const stream = await getLastStream()
        expect(stream.id).to.equal('some-video-id-4')
      })
    })

    context('when there are no items', () => {
      beforeEach(function () {
        listStub.resolves({
          data: {
            items: []
          }
        })
      })

      it('resolves with undefined', async () => {
        const stream = await getLastStream()
        expect(stream).to.be.equal(undefined)
      })
    })
  })
})
