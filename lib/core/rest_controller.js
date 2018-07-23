const Base = require('./base')

class RestController extends Base {
  static get routes () {
    return {
      'GET /': 'index',
      'POST /': 'create',
      'GET /:id': 'show',
      'PUT /:id': 'replace',
      'PATCH /:id': 'update',
      'DELETE /:id': 'destroy'
    }
  }
}

module.exports = RestController
