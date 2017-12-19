'use strict'

/**
 * error中间件
 *
 * 创 建 者：wengeek <wenwei897684475@gmail.com>
 * 创建时间：2017-12-19
 */

const Boom = require('boom')
const path = require('path')
const defaultOutput = require('../lib/output')
const defaultErrorTemplate = path.join(__dirname, '..', 'view', 'error.ejs')

/**
 * error中间件逻辑
 *
 * @param {Object} options 配置
 * @param {number|string} options.status 设置为auto即根据http状态码来设置
 * @param {string} options.type 输出数据格式
 * @param {string} options.template 输出错误视图模板地址
 * @return {Function}
 */
module.exports = (options, app) => {
  options = Object.assign({}, {
    status: 'auto' // 根据错误码设置http状态
  }, options)

  return async (ctx, next) => {
    try {
      await next()
      if (ctx.response.status === 400 && !ctx.response.body) {
        ctx.throw(404)
      }
    } catch (err) {
      app.logger.app.error(err)

      if (!err) {
        err = Boom.badImplementation() // eslint-disable-line
      }

      const code = err.status || 500
      const status = options.status === 'auto' ? code : 200
      ctx.status = status

      let acceptType = options.type || ctx.accepts('json', 'html')

      const output = ctx.app.output || defaultOutput

      switch (acceptType) {
        case 'json':
          let body
          if (err.isBoom) {
            body = output(code, err.message)
          } else if (err.isJoi) {
            if (err.type === 'RequestValidationError') { // 请求参数出错
              body = output(code, 'request validate fail.', undefined, err.details)
            } else if (err.type === 'ResponseValidationError') { // 响应体出错
              body = output(code, 'response validate fail.', undefined, err.details)
            } else {
              body = output(code, 'joi validate fail.', undefined, err.details)
            }
          } else if (err.constructor.name === 'MongooseError') { // mongodb出错
            body = output(code, err.message, undefined, err.details)
          } else {
            body = output(code, err.message || 'Server error.')
          }

          ctx.body = body
          break
        default: // 其他类型显示html
          if (ctx.render) {
            ctx.type = 'text/html'
            await ctx.render(options.template || defaultErrorTemplate, {
              env: ctx.app.env,
              error: err.message,
              stack: err.stack,
              status: ctx.status,
              code: err.code
            })
          } else {
            ctx.body = err.message
          }
      }
    }
  }
}
