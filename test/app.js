const assert = require('assert')
const request = require('supertest')
const app = require('./fixtures/app')

describe('Test app', () => {
  describe('test app request', () => {
    it('request /blog/post?id=123', (done) => {
      request(app.callback())
        .get('/blog/post?id=123')
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err)
          }

          assert.deepEqual({ code: 0, msg: 'ok', data: { username: 'wengeek' } }, JSON.parse(res.text))
          done()
        })
    })
    it('request /blog/post?id=error', (done) => {
      request(app.callback())
        .get('/blog/post?id=error')
        .expect(400)
        .end((err, res) => {
          if (err) {
            return done(err)
          }

          done()
        })
    })
    it('request /api-docs', (done) => {
      request(app.callback())
        .get('/api-docs')
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err)
          }

          done()
        })
    })
  })
})
