module.exports = async (ctx, next) => {
  ctx.d = 'd'

  await next()
}
