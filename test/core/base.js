const request = require('supertest')
const tools = require('../fixtures/tools')
const fse = require('fs-extra')
const path = require('path')

describe('test/core/base.js', () => {
  let app
  let callback
  beforeAll(async () => {
    app = tools.createApp('base')
    callback = await app.callback()
  })

  afterAll(async () => {
    await app.close()
  })

  describe('base.root', () => {
    it('should return root value', async () => {
      const res = await request(callback).get('/root').expect(200)

      expect(res.text).toBe('application')
    })
  })

  describe('base.logger', () => {
    it('should log data', async () => {
      const res = await request(callback).get('/logger').expect(200)

      expect(res.text).toBe('ok')
      await tools.sleep(100)
      expect(fse.readFileSync(path.join(app.baseDir, 'logs', 'default', 'default.log')).toString()).toMatch('base.logger')
    })
  })

  describe('base.helper', () => {
    it('should trigger helper', async () => {
      const res = await request(callback).get('/helper').expect(200)

      expect(res.text).toBe('helper')
    })
  })

  describe('base.config', () => {
    it('should get config value', async () => {
      const res = await request(callback).get('/config').expect(200)

      expect(res.text).toBe('test-base')
    })
  })

  describe('base.service', () => {
    it('should get service data', async () => {
      const res = await request(callback).get('/service').expect(200)

      expect(res.text).toBe('service')
    })
  })

  describe('base.throw', () => {
    it('should get statusCode: 403', async () => {
      await request(callback).get('/throw').expect(403)
    })
  })
})
