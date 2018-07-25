module.exports = (options, app) => {
  options = Object.assign({
    status: 'auto'
  }, options)

  return async (ctx, next) => {
    try {
      await next()
    } catch (err) {
      app.logger.error(err)

      const code = err.status || 500
      const status = options.status === 'auto' ? code : 200
      ctx.status = status

      let acceptType = options.type || ctx.accepts('json', 'html')
      if (acceptType === 'json') {
        ctx.body = app.outputJson(code, null, (err.isJoi && err.type) || err.message, err.details)
        return
      }

      if (acceptType === 'html') {
        ctx.type = 'text/html; charset=utf-8'
        ctx.body = app.outputErrorHtml(code, err)
        return
      }

      ctx.body = err.message
    }
  }
}
