const { Controller } = require('../../../../../..')

class Index extends Controller {
  async actionIndex () {
    return 'ok'
  }
}

module.exports = Index
