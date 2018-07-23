const { Controller } = require('../../../')

class Index extends Controller {
  async actionIndex () {
    this.send({
      code: 'code',
      trim: this.helper.tool.trim()
    }, 200)
  }

  async actionUser () {
    return {
      code: 'index-user'
    }
  }
}

module.exports = Index
