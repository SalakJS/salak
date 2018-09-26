const { Controller } = require('../../../../../../..')

class Index extends Controller {
  makeResponse () {
    this.send({
      a: this.ctx.a,
      b: this.ctx.b,
      c: this.ctx.c,
      d: this.ctx.d,
      e: this.ctx.e,
      f: this.ctx.f,
      g: this.ctx.g
    })
  }

  async actionA () {
    this.makeResponse()
  }

  async actionB () {
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

  async actionF () {
    this.makeResponse()
  }

  async actionG () {
    this.makeResponse()
  }
}

module.exports = Index
