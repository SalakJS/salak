module.exports = async (ctx, next) => {
  ctx.a = 'a'

  await next()
}
