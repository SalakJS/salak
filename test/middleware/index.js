const request = require('supertest')
const tools = require('../fixtures/tools')

describe('test/middleware/index.js', () => {
  let app

  afterEach(async () => {
    await app.close()
  })

  describe('test `not_found`', () => {
    it('should return `302`', async () => {
      app = tools.createApp('app')
      app.setConfig('notFound', { pageUrl: 'https://aotu.io' })
      const callback = await app.callback()
      const res = await request(callback).get('/not-found').expect(302)

      expect(res.header['location']).toBe('https://aotu.io')
    })

    it('should return json or html', async () => {
      app = tools.createApp('app')
      const callback = await app.callback()
      let res = await request(callback).get('/not-found').expect(404)

      expect(res.text).toMatch('404')

      res = await request(callback).get('/unknown').set({ 'Accept': 'application/json' }).expect(404)

      expect(res.body).toEqual({ code: 404, msg: 'Not Found' })
    })

    it('should return custom html', async () => {
      app = tools.createApp('app')
      app.setConfig('notFound', { notFoundHtml: 'error' })
      const callback = await app.callback()
      const res = await request(callback).get('/not-found').expect(404)

      expect(res.text).toBe('error')
    })
  })

  describe('test `error`', () => {
    it('should return json or html', async () => {
      app = tools.createApp('app')
      const callback = await app.callback()

      let res = await request(callback).get('/throw').set({ 'Accept': 'text/html' }).expect(500)
      expect(res.text).toMatch('500')

      res = await request(callback).get('/throw').set({ 'Accept': 'application/json' }).expect(500)
      expect(res.body).toEqual({ code: 500, msg: 'Unknown' })
    })
  })

  describe('test `site_file`', () => {
    it('should set /favicon.ico', async () => {
      app = tools.createApp('app')
      const callback = await app.callback()

      let res = await request(callback).get('/favicon.ico').expect(200)
      expect(res.header['cache-control']).toBe('public, max-age=2592000')
    })
  })
})
