const { Controller } = require('../../../../../../..')

class RBAC extends Controller {
  async actionIndex () {
    return 'admin'
  }
}

module.exports = RBAC
