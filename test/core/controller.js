const request = require('supertest')
const tools = require('../fixtures/tools')

describe('test/core/controller.js', () => {
  let app
  let callback
  beforeAll(async () => {
    app = tools.createApp('controller')
    callback = await app.callback()
  })

  afterAll(async () => {
    await app.close()
  })

  describe('controller.header', () => {
    it('should return header `app` value', async () => {
      const res = await request(callback).get('/header').set({ app: 'salak' }).expect(200)
      expect(res.text).toBe('salak')
    })
  })

  describe('controller.userAgent', () => {
    it('should return user-agent', async () => {
      const res = await request(callback).get('/userAgent').expect(200)

      expect(res.text).toMatch(/node-superagent/)
    })
  })

  describe('controller.query', () => {
    it('should return query data', async () => {
      const res = await request(callback).get('/query?name=salak').expect(200)

      expect(res.text).toBe('salak')
    })
  })

  describe('controller.status', () => {
    it('should get default status 404 and set status 401', async () => {
      const res = await request(callback).get('/status').expect(401)

      expect(res.text).toBe('404')
    })
  })

  describe('controller.body', () => {
    it('should get body', async () => {
      const res = await request(callback).post('/body').send({ name: 'salak' }).expect(200)

      expect(res.text).toBe('salak')
    })
  })

  describe('controller.type', () => {
    it('should get type and set type text', async () => {
      const res = await request(callback).get('/type').set({
        'Content-Type': 'application/text; charset=utf-8'
      }).expect(200)

      expect(res.body.type).toBe('application/text')
      expect(res.headers['content-type']).toBe('application/json; charset=utf-8')
    })
  })

  describe('controller.send', () => {
    it('should set body and status', async () => {
      const res = await request(callback).get('/send').expect(200)

      expect(res.text).toBe('send')
    })
  })

  describe('controller.success', () => {
    it('should return success', async () => {
      const res = await request(callback).get('/success').expect(200)

      expect(res.body.data).toBe('success')
      expect(res.body.code).toBe(0)
    })
  })

  describe('controller.failure', () => {
    it('should return 403', async () => {
      const res = await request(callback).get('/failure').expect(200)

      expect(res.body.code).toBe(403)
    })
  })

  describe('controller.middleware', () => {
    it('should trigger middleware', async () => {
      const res = await request(callback).get('/middleware').expect(200)

      expect(res.text).toBe('test')
    })
  })

  describe('controller response by return', () => {
    it('should get `salak`', async () => {
      const res = await request(callback).get('/return').expect(200)

      expect(res.text).toBe('salak')
    })
  })
})
