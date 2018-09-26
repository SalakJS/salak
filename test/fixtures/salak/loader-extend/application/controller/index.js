const { Controller } = require('../../../../../..')

class Index extends Controller {
  async actionApp () {
    this.body = this.app.say('salak')
  }

  async actionBase () {
    this.body = this.test
  }

  async actionController () {
    this.body = this.say('salak')
  }

  async actionContext () {
    this.body = {
      name: this.ctx.say('salak'),
      userAgent: this.ctx.userAgent
    }
  }

  async actionService () {
    this.body = this.service('test').sayName()
  }

  async actionBehavior () {
    this.body = 'ok'
  }
}

module.exports = Index
