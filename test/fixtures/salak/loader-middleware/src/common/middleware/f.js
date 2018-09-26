module.exports = async (ctx, next) => {
  ctx.f = 'f'

  await next()
}
