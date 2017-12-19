'use strict'

/**
 * view 中间件
 *
 * 创 建 者：wengeek <wenwei897684475@gmail.com>
 * 创建时间：2017-12-19
 */

const views = require('koa-views')

module.exports = (options, app) => {
  return async (ctx, next) => {
    await views('', options)(ctx, next)
  }
}
