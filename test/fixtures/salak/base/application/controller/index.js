const { Controller } = require('../../../../../..')

class Index extends Controller {
  async actionRoot () {
    this.body = this.root
  }

  async actionLogger () {
    this.logger.info('base.logger')
    this.body = 'ok'
  }

  async actionHelper () {
    this.body = this.helper.sign()
  }

  async actionConfig () {
    this.body = this.config('base').name
  }

  async actionService () {
    this.body = this.service('test').getTestName()
  }

  async actionThrow () {
    this.throw(403, 'Forbidden')
    this.body = 'throw'
  }
}

module.exports = Index
