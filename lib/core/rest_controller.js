const Controller = require('./controller')

class RestController extends Controller {
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
