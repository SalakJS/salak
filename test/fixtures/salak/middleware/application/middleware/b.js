module.exports = ({ b = 'b' } = {}, app) => {
  return async (ctx, next) => {
    ctx.b = b

    await next()
  }
}
