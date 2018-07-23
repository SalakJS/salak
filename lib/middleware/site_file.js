const fs = require('fs')
const is = require('is-type-of')
const path = require('path')

const MAX_AGE = 'public, max-age=2592000' // cache 30 days

module.exports = (options, app) => {
  const paths = []

  for (let key in options) {
    const item = options[key]
    if (Buffer.isBuffer(item)) {
      paths[key] = item
      continue
    }

    if (is.string(item) && fs.existsSync(item)) {
      paths[key] = fs.readFileSync(item)
    }
  }

  return async (ctx, next) => {
    if ((ctx.method !== 'HEAD' && ctx.method !== 'GET') || (ctx.path && ctx.path[0] !== '/')) {
      await next()
      return
    }

    const content = paths[ctx.path]

    if (content && Buffer.isBuffer(content)) {
      ctx.set('cache-control', MAX_AGE)
      ctx.body = content
      ctx.type = path.extname(ctx.path)
      return
    }

    await next()
  }
}
