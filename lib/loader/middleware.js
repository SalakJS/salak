const compose = require('koa-compose')
const assert = require('assert')
const path = require('path')
const pathToRegexp = require('path-to-regexp')
const is = require('is-type-of')
const util = require('../util')
const LoaderInterface = require('./loader_interface')

class Middleware extends LoaderInterface {
  load () {
    // load core middleware
    const obj = util.loadDir({
      directory: path.join(__dirname, '..', 'middleware')
    })

    return obj
  }

  loadMiddleware (middlewares = [], module) {
    const allMiddlewares = []
    const isCore = module === 'core'
    const moduleMiddlewares = isCore ? this.app.coreMiddlewares : this.app.middlewares[module]
    const commonMiddlewares = this.app.middlewares[this.app.root]

    this.app.logger.debug(`Using middlewares in ${module}:`, middlewares.map((item) => is.object(item) ? item.name : item))
    for (let middleware of middlewares) {
      let middlewareName
      let middlewareFn

      if (is.string(middleware)) {
        middlewareName = middleware
        // recall root middleware
        middlewareFn = moduleMiddlewares[middleware] || commonMiddlewares[middleware]
      } else if (is.object(middleware)) {
        middlewareName = middleware.name
        middlewareFn = middleware.package

        if (is.string(middlewareFn)) {
          middlewareFn = require(middlewareFn)
        }
      }

      assert(middlewareName && middlewareFn, `salak ${module} middleware: ${middleware} was not found`)

      const options = this.app.config(middlewareName, isCore ? this.app.root : module) || {}

      if (options.enable === false) {
        this.app.logger.debug(`Disable ${module} middleware: ${middlewareName}`)
        continue
      }

      if (!is.asyncFunction(middlewareFn)) {
        middlewareFn = middlewareFn(options, this.app)
      }

      this.app.logger.debug(`Using middleware: ${middlewareName}`)

      assert(!(options.match && options.ignore), `Middleware: ${module}/${middlewareName} options.match and options.ignore cannot both present.`)

      allMiddlewares.push(this._wrapMiddleware(middlewareFn, options))
    }

    return allMiddlewares.length && compose(allMiddlewares)
  }

  _wrapMiddleware (middleware, options = {}) {
    if (!options.match && !options.ignore) {
      return middleware
    }

    const matchFn = this._pathMatch(options.match || options.ignore)
    return async (ctx, next) => {
      const matched = matchFn(ctx)

      if (options.match ? matched : !matched) {
        await middleware(ctx, next)
        return
      }

      await next()
    }
  }

  _pathMatch (pattern) {
    const reg = is.string(pattern) ? pathToRegexp(pattern, [], { end: false }) : pattern

    if (is.regExp(reg)) {
      return (ctx) => {
        if (reg.global) {
          reg.lastIndex = 0
        }

        return reg.test(ctx.path)
      }
    }

    if (is.function(pattern)) {
      return pattern
    }

    if (is.array(pattern)) {
      const matches = pattern.map((item) => this._pathMatch(item))
      return (ctx) => {
        return matches.some((match) => match(ctx))
      }
    }

    throw new Error(`match/ignore match be RegExp, Array or String, but got ${pattern}`)
  }
}

module.exports = Middleware
