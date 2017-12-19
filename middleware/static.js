const server = require('koa-static')
const path = require('path')

module.exports = (options, app) => {
  options = Object.assign({}, {
    root: path.join(app.baseDir, 'public'),
    opts: {}
  }, options)

  return async (ctx, next) => {
    await server(options.root, options.opts)(ctx, next)
  }
}
