'use strict'

/**
 * Rest 控制器
 *
 * 创 建 者：wengeek <wenwei897684475@gmail.com>
 * 创建时间：2017-12-19
 */

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
