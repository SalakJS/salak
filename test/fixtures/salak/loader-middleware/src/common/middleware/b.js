module.exports = (app) => {
  return async (ctx, next) => {
    ctx.b = 'b'
    await next()
  }
}
