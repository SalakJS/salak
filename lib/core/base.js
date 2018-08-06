const createError = require('http-errors')

class Base {
  constructor (app, module) {
    this.app = app
    this.module = module
  }

  get root () {
    return this.app.root
  }

  get logger () {
    return this.app.logger
  }

  get helper () {
    return this.app.helper
  }

  config (key, module = this.module) {
    return this.app.config(key, module)
  }

  service (name, module = this.module, ...args) {
    return this.app.service(name, module, ...args)
  }

  throw (...args) {
    throw createError(...args)
  }
}

module.exports = Base
