const { Controller } = require('../../../../../..')

class Index extends Controller {
  async actionIndex () {
    this.success('ok')
  }

  async actionThrow () {
    throw new Error('Unknown')
  }
}

module.exports = Index
