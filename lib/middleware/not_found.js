module.exports = ({ type, pageUrl, notFoundHtml }, app) => {
  return async (ctx, next) => {
    await next()

    if (ctx.status !== 404 || ctx.body) {
      return
    }

    ctx.status = 404

    if (pageUrl) {
      ctx.redirect(pageUrl)
      return
    }

    const acceptType = type || ctx.accepts('html', 'text', 'json')
    if (acceptType === 'json') {
      ctx.body = app.outputJson(404, null, 'Not Found')
      return
    }

    ctx.type = 'text/html; charset=utf-8'
    if (notFoundHtml) {
      ctx.body = notFoundHtml
      return
    }

    ctx.body = app.outputErrorHtml(404, { message: 'Not Found' })
  }
}
