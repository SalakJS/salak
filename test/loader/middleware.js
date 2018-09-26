const request = require('supertest')
const tools = require('../fixtures/tools')

describe('test/loader/middleware.js', () => {
  let app
  let callback
  beforeAll(async () => {
    app = tools.createApp('loader-middleware', {
      app: 'src',
      root: 'common'
    })
    callback = await app.callback()
  })

  afterAll(async () => {
    await app.close()
  })

  describe('middleware options.enable', () => {
    it('should not get `a`', async () => {
      const res = await request(callback).get('/user/a').expect(200)

      expect(res.body).toEqual({
        c: 'c',
        d: 'd'
      })
    })
  })

  describe('middleware options.match', () => {
    it('should get `b`', async () => {
      const res = await request(callback).get('/user/b').expect(200)

      expect(res.body).toEqual({
        b: 'b',
        c: 'c',
        d: 'd'
      })
    })
  })

  describe('middleware options.ignore', () => {
    it('should not get `c`', async () => {
      const res = await request(callback).get('/user/c').expect(200)

      expect(res.body).toEqual({
        d: 'd'
      })
    })
  })

  describe('middleware options.match/ignore can be function', async () => {
    it('should get `d`', async () => {
      const res = await request(callback).get('/user/d').expect(200)

      expect(res.body).toEqual({
        c: 'c',
        d: 'd'
      })
    })

    it('should not get `d`', async () => {
      const res = await request(callback).get('/user/d').set({ 'User-Agent': 'test' }).expect(200)

      expect(res.body).toEqual({
        c: 'c'
      })
    })
  })

  describe('middleware options.match/ignore can be regex', () => {
    it('should get `e`', async () => {
      const res = await request(callback).get('/user/e').expect(200)

      expect(res.body).toEqual({
        c: 'c',
        d: 'd',
        e: 'e'
      })
    })
  })

  describe('middleware options.match/ingore can be array', () => {
    it('should get `f` when call `/user/f`', async () => {
      const res = await request(callback).get('/user/f').expect(200)

      expect(res.body).toEqual({
        c: 'c',
        d: 'd',
        f: 'f'
      })
    })

    it('should get `f` when call `/user/g`', async () => {
      const res = await request(callback).get('/user/g').expect(200)

      expect(res.body).toEqual({
        c: 'c',
        d: 'd',
        f: 'f'
      })
    })
  })
})
