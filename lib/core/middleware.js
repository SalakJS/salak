const extend = require('extend')
const assert = require('assert')
const is = require('is-type-of')
const util = require('../util')

const PUSH_INTO_ARRAY = Symbol('middleware#pushToArray')
const EXECUTE = Symbol('middleware#execute')

class Middleware {
  constructor (name, module, options, caller) {
    this.ignores = []
    this.onlies = []
    this.name = name
    this.module = module
    this.options = options
    this.caller = caller
  }

  only (routes) {
    return this[PUSH_INTO_ARRAY](routes, this.onlies)
  }

  except (routes) {
    return this[PUSH_INTO_ARRAY](routes, this.ignores)
  }

  [PUSH_INTO_ARRAY] (routes = '', target) {
    if (typeof routes === 'string') {
      routes = routes.split(' ')
    }

    if (Array.isArray(routes)) {
      routes.forEach((item = '') => {
        item = item.trim()
        if (item !== '' && target.indexOf(item) === -1) {
          target.push(item)
        }
      })
    }

    return this
  }

  [EXECUTE] (action = '') {
    if (this.ignores.indexOf(action) !== -1 || this.onlies.indexOf(action) === -1) {
      return
    }

    return async (ctx, next) => {
      let middleware = this.name
      let config = this.options
      let caller = this.caller
      let app = ctx.app
      if (!is.function(this.name)) {
        const middlewares = app.middlewares
        const moduleMiddlewares = middlewares[this.module] || {}
        middleware = moduleMiddlewares[this.name]

        const defaultConfig = app.config(this.name, this.module)

        config = util.isPlainObject(config) ? extend(true, {}, defaultConfig, config) : (config || defaultConfig)
        caller = null
      }

      assert(middleware, `unknown middleware [${this.name}] in module [${this.module}]`)

      if (config && config.enable === false) {
        await next()
        return
      }

      if (is.asyncFunction(middleware)) {
        await middleware.call(caller, ctx, next)
        return
      }

      const fn = middleware.call(caller, config, ctx.app)
      if (!is.asyncFunction(fn)) {
        await next()
        return
      }

      await fn.call(caller, ctx, next)
    }
  }
}

module.exports = Middleware
module.exports.EXECUTE = EXECUTE
