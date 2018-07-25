const Base = require('./base')
const Middleware = require('../core/middleware')

const MIDDLEWARES = Symbol('controller#middlewares')

class Controller extends Base {
  constructor (ctx, module) {
    super(ctx.app, module)

    this.ctx = ctx
    this[MIDDLEWARES] = []
  }

  static get routes () {
    return {}
  }

  get header () {
    return this.ctx.request.header
  }

  get userAgent () {
    return this.header['user-agent']
  }

  get query () {
    return this.ctx.request.query
  }

  get status () {
    return this.ctx.status
  }

  set status (status) {
    this.ctx.status = status
  }

  get body () {
    return this.ctx.body
  }

  set body (value) {
    this.ctx.body = value
  }

  get type () {
    return this.ctx.type
  }

  set type (value) {
    this.ctx.type = value
  }

  send (body, status = 200) {
    this.status = status
    this.body = body
  }

  success (data, message = '', code = 0) {
    this.send(this.app.outputJson({
      code,
      data,
      msg: message
    }))
  }

  failure (code, message = '', data) {
    this.send(this.app.outputJson({
      code,
      message,
      data
    }))
  }

  middleware (name, module, options) {
    if (!module) {
      module = this.module
    }

    const middleware = new Middleware(name, module, options, this)

    this[MIDDLEWARES].push(middleware)
    return middleware
  }
}

module.exports = Controller
module.exports.middlewares = MIDDLEWARES
