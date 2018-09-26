const request = require('supertest')
const tools = require('../fixtures/tools')

describe('test/loader/extend.js', () => {
  let app
  let callback
  beforeAll(async () => {
    app = tools.createApp('loader-extend')
    callback = await app.callback()
  })

  afterAll(async () => {
    await app.close()
  })

  describe('extend app', () => {
    it('should return `app-salak`', async () => {
      const res = await request(callback).get('/app').expect(200)

      expect(res.text).toBe('app-salak')
    })
  })

  describe('extend base', () => {
    it('should return `salak-test`', async () => {
      const res = await request(callback).get('/base').expect(200)

      expect(res.text).toBe('salak-test')
    })
  })

  describe('extend controller & inject app', () => {
    it('should return `controller-salak`', async () => {
      const res = await request(callback).get('/controller').expect(200)

      expect(res.text).toBe('controller-salak')
    })
  })

  describe('extend context', () => {
    it('should return userAgent & name', async () => {
      const res = await request(callback).get('/context').expect(200)

      expect(res.body.name).toBe('context-salak')
      expect(res.body.userAgent).toMatch(/node/)
    })
  })

  describe('extend service', () => {
    it('should return `service-salak`', async () => {
      const res = await request(callback).get('/service').expect(200)

      expect(res.text).toBe('service-salak')
    })
  })

  describe('extend behavior', () => {
    it('should return `ok`', async () => {
      const res = await request(callback).get('/behavior?version=10').expect(200)

      expect(res.text).toBe('ok')
    })

    it('should get `400` when version is not a number', async () => {
      await request(callback).get('/behavior?version=salak').expect(400)
    })
  })

  describe('extend schedule', () => {
    it('should get `schedule-salak`', () => {
      expect(app.testSchedule).toBe('schedule-salak')
    })
  })
})
