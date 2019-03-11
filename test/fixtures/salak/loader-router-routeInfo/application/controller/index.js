const { Controller } = require('../../../../../..')

class Index extends Controller {
  async actionIndex () {
    const { routeInfo } = this.ctx
    this.send(routeInfo)
  }
}

module.exports = Index
