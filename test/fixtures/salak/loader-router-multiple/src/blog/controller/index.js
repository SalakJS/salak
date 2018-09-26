const { Controller } = require('../../../../../../..')

class Index extends Controller {
  static get routes () {
    return {
      'GET /:id': 'show'
    }
  }

  async actionShow (id) {
    return id
  }
}

module.exports = Index
