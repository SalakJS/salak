const request = require('supertest')
const tools = require('../fixtures/tools')

describe('test/loader/router.js', () => {
  describe('test `single` mode', () => {
    let app
    let callback
    beforeAll(async () => {
      app = tools.createApp('loader-router-single')
      callback = await app.callback()
    })

    afterAll(async () => {
      await app.close()
    })

    describe('set default route', () => {
      it('should return `welcome`', async () => {
        const res = await request(callback).get('/').expect(200)

        expect(res.text).toBe('welcome')
      })
    })

    describe('set params', () => {
      it('should return `name`', async () => {
        const res = await request(callback).get('/welcome/say/salak').expect(200)

        expect(res.text).toBe('salak')
      })
    })
  })

  describe('test `multiple` mode', () => {
    let app
    let callback
    beforeAll(async () => {
      app = tools.createApp('loader-router-multiple', { root: 'common', app: 'src' })
      callback = await app.callback()
    })

    afterAll(async () => {
      await app.close()
    })

    describe('set default root route', () => {
      it('should return `admin`', async () => {
        const res = await request(callback).get('/').expect(200)

        expect(res.text).toBe('admin')
      })
    })

    describe('set default module route', () => {
      it('should return object which contain both `a` with `b`', async () => {
        const res = await request(callback).get('/user').expect(200)

        expect(res.body).toEqual({ a: 'a', b: 'b' })
      })
    })

    describe('`prefix` & `loadOrder`', () => {
      it('should return `comment`', async () => {
        const res = await request(callback).get('/articles/comment').expect(200)

        expect(res.text).toBe('comment')
      })

      it('should return `id`', async () => {
        const res = await request(callback).get('/articles/123').expect(200)

        expect(res.text).toBe('123')
      })
    })
  })
})
