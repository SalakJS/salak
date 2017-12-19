'use strict'

/**
 * jsonp中间件
 *
 * 创 建 者：wengeek <wenwei897684475@gmail.com>
 * 创建时间：2017-12-19
 */

const jsonp = require('jsonp-body')

module.exports = (options, app) => {
  return async (ctx, next) => {
    await next()

    if (ctx.body && ctx.method === 'GET' && ctx.type !== 'text/html') { // 过滤html类型，配合error
      if (ctx.query.callback) {
        ctx.set('Content-Type', 'text/javascript')
        ctx.body = jsonp(ctx.body, ctx.query.callback)
      }
    }
  }
}
