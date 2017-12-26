'use strict'

/**
 * 框架内置的中间件
 *
 * 创 建 者：wengeek <wenwei897684475@gmail.com>
 * 创建时间：2017-12-19
 */

module.exports = {
  buildInMiddlewares: {
    output: require('../middleware/output'),
    bodyparser: require('koa-bodyparser'),
    error: require('../middleware/error'),
    swagger: require('../middleware/swagger'),
    view: require('../middleware/view'),
    cors: require('../middleware/cors'),
    jsonp: require('../middleware/jsonp'),
    static: require('../middleware/static')
  },
  buildInMiddlewaresOrder: [
    'output',
    'static',
    'bodyparser',
    'cors',
    'jsonp',
    'error',
    'view',
    'swagger'
  ]
}
