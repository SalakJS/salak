'use strict'

/**
 * 静态资源加载中间件
 *
 * 创 建 者：wengeek <wenwei897684475@gmail.com>
 * 创建时间：2017-12-19
 */

const server = require('koa-static')
const path = require('path')

/**
 * @param {Object} options 配置
 * @param {string} options.root 静态资源目录地址
 * @param {Object} options.opts koa-static 配置
 */
module.exports = (options, app) => {
  options = Object.assign({}, {
    root: path.join(app.baseDir, 'public'),
    opts: {}
  }, options)

  return async (ctx, next) => {
    await server(options.root, options.opts)(ctx, next)
  }
}
