module.exports = async (ctx, next) => {
  ctx.c = 'c'

  await next()
}
