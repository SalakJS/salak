const request = require('supertest')
const tools = require('../fixtures/tools')

describe('test/core/behavior.js', () => {
  let app
  let callback
  beforeAll(async () => {
    app = tools.createApp('behavior')
    callback = await app.callback()
  })

  afterAll(async () => {
    await app.close()
  })

  describe('behavior rules', () => {
    it('should validate id', async () => {
      const res = await request(callback).get('/?id=123').expect(200)
      expect(res.text).toBe('123')

      await request(callback).get('/').expect(400)
    })
  })

  describe('behavior.behavior()', () => {
    it('should return name', async () => {
      await request(callback).get('/name').expect(400)

      const res = await request(callback).get('/name?name=salak').expect(200)
      expect(res.text).toBe('salak')
    })
  })
})
