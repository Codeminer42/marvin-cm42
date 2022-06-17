const { DateTime } = require('luxon')
const { expect } = require('chai')

const { isAllowedStreamYardUser, preventUrlExpansion, getDayName, getNextStreamDateAvailable } = require('../../lib/utils')

describe('/lib/utils', () => {
  describe('.isAllowedStreamYardUser', () => {
    it('returns true for allowed uers', () => {
      process.env.ALLOWED_STREAMYARD_USERS = ['123']
      // eslint-disable-next-line no-unused-expressions
      expect(isAllowedStreamYardUser(123)).to.be.true
    })

    it('returns false for disallowed uers', () => {
      process.env.ALLOWED_STREAMYARD_USERS = ['123']
      // eslint-disable-next-line no-unused-expressions
      expect(isAllowedStreamYardUser(456)).to.be.false
    })
  })

  describe('.preventUrlExpansion', () => {
    it('wraps url in <> but do not touch other text', () => {
      const message = [
        'some simple message with',
        'one urt at http://example.com/foobar',
        'and other at http://codeminer42.com.br?somequery=dont%20panic'
      ].join('\n')

      expect(preventUrlExpansion(message)).to.eq([
        'some simple message with',
        'one urt at <http://example.com/foobar>',
        'and other at <http://codeminer42.com.br?somequery=dont%20panic>'
      ].join('\n'))
    })
  })

  describe('.getDayName', () => {
    it('returns an uppercase string', () => {
      const dateTime = DateTime.local()
      const subject = getDayName(dateTime)
      expect(subject).to.eq(subject.toUpperCase())
    })

    it('returns the name of each day of the week', () => {
      expect(getDayName(DateTime.local(2022, 3, 20))).to.eq('DOMINGO')
      expect(getDayName(DateTime.local(2022, 3, 21))).to.eq('SEGUNDA-FEIRA')
      expect(getDayName(DateTime.local(2022, 3, 22))).to.eq('TERÇA-FEIRA')
      expect(getDayName(DateTime.local(2022, 3, 23))).to.eq('QUARTA-FEIRA')
      expect(getDayName(DateTime.local(2022, 3, 24))).to.eq('QUINTA-FEIRA')
      expect(getDayName(DateTime.local(2022, 3, 25))).to.eq('SEXTA-FEIRA')
      expect(getDayName(DateTime.local(2022, 3, 26))).to.eq('SÁBADO')
    })

    context('when given a locale', () => {
      it('returns the translated day of the week', () => {
        expect(getDayName(DateTime.local(2022, 3, 20), 'en')).to.eq('SUNDAY')
        expect(getDayName(DateTime.local(2022, 3, 21), 'en')).to.eq('MONDAY')
        expect(getDayName(DateTime.local(2022, 3, 22), 'en')).to.eq('TUESDAY')
        expect(getDayName(DateTime.local(2022, 3, 23), 'en')).to.eq('WEDNESDAY')
        expect(getDayName(DateTime.local(2022, 3, 24), 'en')).to.eq('THURSDAY')
        expect(getDayName(DateTime.local(2022, 3, 25), 'en')).to.eq('FRIDAY')
        expect(getDayName(DateTime.local(2022, 3, 26), 'en')).to.eq('SATURDAY')
      })
    })
  })

  describe('.getNextStreamDateAvailable', () => {
    describe('when there are no upcoming streams', () => {
      it('returns the next Thursday date', () => {
        const dates = []

        const expectedWeekDay = 4
        const actualWeekDay = getNextStreamDateAvailable(dates).weekday

        expect(expectedWeekDay).to.eql(actualWeekDay)
      })
    })

    describe('when there are no available date before the last upcoming stream', () => {
      it('returns the last date + 7 days', () => {
        const dates = [
          DateTime.utc(2022, 6, 2),
          DateTime.utc(2022, 6, 9),
          DateTime.utc(2022, 6, 16),
          DateTime.utc(2022, 6, 23)
        ]

        const expectedDate = DateTime.utc(2022, 6, 30)

        expect(getNextStreamDateAvailable(dates)).to.eql(expectedDate)
      })
    })

    describe('when there is a single available date before the last upcoming stream', () => {
      it('returns the first available date in the gap', () => {
        const dates = [
          DateTime.utc(2022, 6, 2),
          DateTime.utc(2022, 6, 16),
          DateTime.utc(2022, 6, 23)
        ]

        const expectedDate = DateTime.utc(2022, 6, 9)

        expect(getNextStreamDateAvailable(dates)).to.eql(expectedDate)
      })
    })

    describe('when there are N available dates before the last upcoming stream', () => {
      it('returns the first available date in the gap', () => {
        const dates = [
          DateTime.utc(2022, 6, 2),
          DateTime.utc(2022, 6, 23)
        ]

        const expectedDate = DateTime.utc(2022, 6, 9)

        expect(getNextStreamDateAvailable(dates)).to.eql(expectedDate)
      })
    })
  })
})
