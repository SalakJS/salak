const request = require('supertest')
const tools = require('../fixtures/tools')

describe('test/loader/swagger.js', () => {
  let app
  let callback
  beforeAll(async () => {
    app = tools.createApp('loader-swagger')
    callback = await app.callback()
  })

  afterAll(async () => {
    await app.close()
  })

  describe('register apis', () => {
    it('should register /api-docs', async () => {
      const res = await request(callback).get('/api-docs').expect(200)

      expect(res.header['content-type']).toMatch('html')
    })

    it('should register /api-json', async () => {
      const res = await request(callback).get('/api-json').expect(200)

      expect(res.header['content-type']).toMatch('json')
    })
  })
})
