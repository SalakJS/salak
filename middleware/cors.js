'use strict'

/**
 * 跨域
 *
 * 创 建 者：wengeek <wenwei897684475@gmail.com>
 * 创建时间：2017-12-18
 */

/**
 * 设置跨域
 *
 * @param {Object} options cors配置
 * @param {Array|string} options.allowMethods 允许的方法
 * @param {Array|string} options.exposeHeaders 允许暴露的响应首部
 * @param {Array|string} options.allowHeaders 允许的头部
 * @param {Array|string} options.maxAge 用于设置preflight缓存时间
 * @param {Boolean} options.credentials 是否允许cookie
 */
module.exports = (options, app) => {
  const defaults = {
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
  }

  options = Object.assign({}, defaults, options)

  if (Array.isArray(options.exposeHeaders)) {
    options.exposeHeaders = options.exposeHeaders.join(',')
  }

  if (Array.isArray(options.allowMethods)) {
    options.allowMethods = options.allowMethods.join(',')
  }

  if (Array.isArray(options.allowHeaders)) {
    options.allowHeaders = options.allowHeaders.join(',')
  }

  if (options.maxAge) {
    options.maxAge = String(options.maxAge)
  }

  options.credentials = !!options.credentials

  return async (ctx, next) => {
    const requestOrigin = ctx.get('Origin')

    ctx.vary('Origin')

    if (!requestOrigin) {
      await next()
      return
    }

    let origin

    if (typeof options.origin === 'function') {
      origin = options.origin(ctx)
      if (!origin) {
        await next()
        return
      }
    } else {
      origin = options.origin || requestOrigin
    }

    const headersSet = {}

    function set (key, value) {
      ctx.set(key, value)
      headersSet[key] = value
    }

    if (ctx.method !== 'OPTIONS') {
      set('Access-Control-Allow-Origin', origin)

      if (options.credentials === true) {
        set('Access-Control-Allow-Credentials', 'true')
      }

      if (options.exposeHeaders) {
        set('Access-Control-Expose-Headers', options.exposeHeaders)
      }

      await next()
    } else {
      // Preflight Request
      if (!ctx.get('Access-Control-Request-Method')) {
        await next()
        return
      }

      ctx.set('Access-Control-Allow-Origin', origin)

      if (options.credentials === true) {
        ctx.set('Access-Control-Allow-Credentials', 'true')
      }

      if (options.maxAge) {
        ctx.set('Access-Control-Max-Age', options.maxAge)
      }

      if (options.allowMethods) {
        ctx.set('Access-Control-Allow-Methods', options.allowMethods)
      }

      let allowHeaders = options.allowHeaders
      if (!allowHeaders) {
        allowHeaders = ctx.get('Access-Control-Request-Headers')
      }

      if (allowHeaders) {
        ctx.set('Access-Control-Allow-Headers', allowHeaders)
      }

      ctx.status = 204
    }
  }
}
