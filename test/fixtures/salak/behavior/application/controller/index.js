const { Controller } = require('../../../../../..')

class Index extends Controller {
  async actionIndex () {
    this.body = this.query.id
  }

  async actionName () {
    this.body = this.query.name
  }
}

module.exports = Index
