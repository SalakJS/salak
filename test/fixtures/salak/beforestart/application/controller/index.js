const { Controller } = require('../../../../../..')

class Index extends Controller {
  async actionIndex () {
    this.success(this.app.data || 'none')
  }
}

module.exports = Index
