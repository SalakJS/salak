const request = require('supertest')
const tools = require('../fixtures/tools')

describe('test/core/middleware.js', () => {
  let app
  let callback
  beforeAll(async () => {
    app = tools.createApp('middleware')
    callback = await app.callback()
  })

  afterAll(async () => {
    await app.close()
  })

  describe('middleware always triggers', () => {
    it('should get `a`', async () => {
      const res = await request(callback).get('/a').expect(200)

      expect(res.body).toEqual({ a: 'a', c: 'c' })
    })
  })

  describe('middleware only or except params can be array', () => {
    it('should get `d`', async () => {
      const res = await request(callback).get('/d').expect(200)

      expect(res.body).toEqual({ a: 'a', c: 'c', d: 'd' })
    })
  })

  describe('middleware can be disabled by options.enable', () => {
    it('should not get `e`', async () => {
      const res = await request(callback).get('/e').expect(200)

      expect(res.body).toEqual({ a: 'a', c: 'c' })
    })
  })

  describe('middleware can trigger with options', () => {
    it('should return `test`', async () => {
      const res = await request(callback).get('/bWithOptions').expect(200)

      expect(res.body).toEqual({ a: 'a', b: 'test', c: 'c' })
    })
  })

  describe('middleware.only()', () => {
    it('should only trigger b', async () => {
      const res = await request(callback).get('/b').expect(200)

      expect(res.body).toEqual({ a: 'a', b: 'b', c: 'c' })
    })
  })

  describe('middleware.except()', () => {
    it('should not contain `c`', async () => {
      const res = await request(callback).get('/c').expect(200)

      expect(res.body).toEqual({ a: 'a' })
    })
  })

  describe('middleware inline controller', () => {
    it('should get `inline`', async () => {
      const res = await request(callback).get('/inline').expect(200)

      expect(res.body).toEqual({ a: 'a', inline: 'inline', c: 'c' })
    })
  })
})
