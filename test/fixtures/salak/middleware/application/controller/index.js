const { Controller } = require('../../../../../..')

class Index extends Controller {
  constructor (...args) {
    super(...args)

    this.middleware('a')
    this.middleware('b', this.module, { b: 'test' }).only('bWithOptions')
    this.middleware('b').only('b')
    this.middleware('c').except('c')
    this.middleware('d').only(['d'])
    this.middleware('e', this.module, { enable: false }).only(['e'])
    this.middleware(this.inlineMiddleware).only('inline')
  }

  makeResponse () {
    this.body = {
      a: this.ctx.a,
      b: this.ctx.b,
      c: this.ctx.c,
      d: this.ctx.d,
      e: this.ctx.e,
      inline: this.ctx.inline
    }
  }

  async inlineMiddleware (ctx, next) {
    ctx.inline = 'inline'
    await next()
  }

  async actionInline () {
    this.makeResponse()
  }

  async actionA () {
    this.makeResponse()
  }

  async actionB () {
    this.makeResponse()
  }

  async actionBWithOptions () {
    this.makeResponse()
  }

  async actionC () {
    this.makeResponse()
  }

  async actionD () {
    this.makeResponse()
  }

  async actionE () {
    this.makeResponse()
  }
}

module.exports = Index
