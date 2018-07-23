const { Controller } = require('../../../')

class Index extends Controller {
  async actionIndex () {
    this.send({
      code: 'user'
    }, 200)
  }
}

module.exports = Index
