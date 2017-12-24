'use strict'

/**
 * 框架内置的中间件
 *
 * 创 建 者：wengeek <wenwei897684475@gmail.com>
 * 创建时间：2017-12-19
 */

module.exports = {
  buildInMiddlewares: {
    bodyparser: require('koa-bodyparser'),
    error: require('../middleware/error'),
    swagger: require('../middleware/swagger'),
    view: require('../middleware/view'),
    cors: require('../middleware/cors'),
    jsonp: require('../middleware/jsonp'),
    static: require('../middleware/static')
  },
  buildInMiddlewaresOrder: [
    'static',
    'bodyparser',
    'cors',
    'jsonp',
    'view',
    'error',
    'swagger'
  ]
}