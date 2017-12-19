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
