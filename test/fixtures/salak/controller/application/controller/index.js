const { Controller } = require('../../../../../..')

class Index extends Controller {
  constructor (...args) {
    super(...args)

    this.middleware(this.test).only('middleware')
  }

  async test (ctx, next) {
    ctx.test = 'test'
    await next()
  }

  static get routes () {
    return {
      'POST /body': 'body'
    }
  }

  async actionHeader () {
    this.body = this.header.app
  }

  async actionUserAgent () {
    this.body = this.userAgent
  }

  async actionQuery () {
    this.body = this.query.name
  }

  async actionStatus () {
    this.body = this.status
    this.status = 401
  }

  async actionBody () {
    const { name } = this.body

    this.body = name
  }

  async actionType () {
    this.body = {
      type: this.type
    }

    this.type = 'json'
  }

  async actionSend () {
    this.send('send')
  }

  async actionSuccess () {
    this.success('success')
  }

  async actionFailure () {
    this.failure(403)
  }

  async actionMiddleware () {
    this.body = this.ctx.test
  }

  async actionReturn () {
    return 'salak'
  }
}

module.exports = Index
