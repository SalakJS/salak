module.exports = async (ctx, next) => {
  ctx.b = 'b'
  await next()
}
