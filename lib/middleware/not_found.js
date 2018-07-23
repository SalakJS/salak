module.exports = ({ pageUrl, notFoundHtml }, app) => {
  return async (ctx, next) => {
    await next()

    if (ctx.status !== 404 || ctx.body) {
      return
    }

    ctx.status = 404

    if (ctx.accepts('html', 'text', 'json') === 'json') {
      ctx.body = {
        message: 'Not Found'
      }

      return
    }

    if (pageUrl) {
      ctx.redirect(pageUrl)
      return
    }

    ctx.body = notFoundHtml
  }
}
