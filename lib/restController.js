const Controller = require('./controller')

class RestController extends Controller {}

RestController[Controller.buildInRoutes] = {
  'GET /': 'index',
  'POST /': 'create',
  'GET /:id': 'show',
  'PUT /:id': 'replace',
  'PATCH /:id': 'update',
  'DELETE /:id': 'destroy'
}

module.exports = RestController
