const request = require('supertest')
const tools = require('../fixtures/tools')

describe('test/core/rest-controller.js', () => {
  let app
  let callback
  beforeAll(async () => {
    app = tools.createApp('rest-controller')
    callback = await app.callback()
  })

  afterAll(async () => {
    await app.close()
  })

  describe('GET /', () => {
    it('should return `list`', async () => {
      const res = await request(callback).get('/').expect(200)

      expect(res.text).toBe('list')
    })
  })

  describe('POST /', () => {
    it('should return body', async () => {
      const res = await request(callback).post('/').send({ name: 'salak' }).expect(201)

      expect(res.body).toEqual({ name: 'salak' })
    })
  })

  describe('GET /:id', () => {
    it('should return `GET 123`', async () => {
      const res = await request(callback).get('/123').expect(200)

      expect(res.text).toBe('GET 123')
    })
  })

  describe('PUT /:id', () => {
    it('should return `PUT 123`', async () => {
      const res = await request(callback).put('/123').expect(201)

      expect(res.text).toBe('PUT 123')
    })
  })

  describe('PATCH /:id', () => {
    it('should return `PATCH 123`', async () => {
      const res = await request(callback).patch('/123').expect(201)

      expect(res.text).toBe('PATCH 123')
    })
  })

  describe('DELETE /:id', () => {
    it('should get statusCode `204`', async () => {
      const res = await request(callback).delete('/123').expect(204)

      expect(res.text).toBe('')
    })
  })
})
