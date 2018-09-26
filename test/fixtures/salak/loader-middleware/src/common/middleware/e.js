module.exports = async (ctx, next) => {
  ctx.e = 'e'

  await next()
}
