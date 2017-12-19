const views = require('koa-views')

module.exports = (options, app) => {
  return async (ctx, next) => {
    await views('', options)(ctx, next)
  }
}
