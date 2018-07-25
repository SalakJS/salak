const compose = require('koa-compose')
const assert = require('assert')
const path = require('path')
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

    this.app.logger.debug(`Using middlewares in ${module}:`, middlewares.map((item) => is.object(item) ? item.name : item))
    for (let middleware of middlewares) {
      let middlewareName
      let middlewareFn

      if (is.string(middleware)) {
        middlewareName = middleware
        middlewareFn = moduleMiddlewares[middleware]
      } else if (is.object(middleware)) {
        middlewareName = middleware.name
        middlewareFn = middleware.package

        if (is.string(middlewareFn)) {
          middlewareFn = require(middlewareFn)
        }
      }

      assert(middlewareName && middlewareFn, `salak ${module} middleware: ${middleware} was not found`)

      const options = this.app.config(middlewareName, isCore ? this.app.root : module) || {}

      // system middleware must be enabled
      if (!isCore && options.enable === false) {
        this.app.logger.debug(`Disable middleware: ${middlewareName}`)
        continue
      }

      if (!is.asyncFunction(middlewareFn)) {
        middlewareFn = middlewareFn(options, this.app)
      }

      if (!is.asyncFunction(middlewareFn)) {
        this.app.logger.warn(`Middleware: ${middleware} must be async function.`)
        continue
      }

      this.app.logger.debug(`Using middleware: ${middlewareName}`)
      allMiddlewares.push(middlewareFn)
    }

    return allMiddlewares.length && compose(allMiddlewares)
  }
}

module.exports = Middleware
