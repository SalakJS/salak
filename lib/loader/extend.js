const path = require('path')
const LoaderInterface = require('./loader_interface')
const Base = require('../core/base')
const Service = require('../core/service')
const Controller = require('../core/controller')
const Schedule = require('../core/schedule')
const Behavior = require('../core/behavior')
const util = require('../util')

class Extend extends LoaderInterface {
  constructor (...args) {
    super(...args)

    this.allowedExtends = {
      app: this.app,
      context: this.app.context,
      base: Base.prototype,
      service: Service.prototype,
      controller: Controller.prototype,
      schedule: Schedule.prototype,
      behavior: Behavior.prototype
    }
  }

  load () { // extend: app common
    const obj = util.loadDir({
      directory: path.join(this.app.modules[this.app.root], 'extend'),
      match: ['*.js'],
      call: this.injectApp
    })

    if (Object.keys(obj).length) {
      this.app.logger.debug('Load App Extends:', Object.keys(obj))
      this.loadExtend(obj)
    }
  }

  loadExtend (options = {}) {
    for (let key in options) {
      if (!this.allowedExtends[key]) {
        continue
      }

      this.app.logger.debug('Load Extend:', key, Object.keys(options[key]))
      this._extend(this.allowedExtends[key], options[key])
    }
  }

  _extend (target, source) {
    const properties = Object.getOwnPropertyNames(source).concat(Object.getOwnPropertySymbols(source))

    for (let property of properties) {
      const descriptor = Object.getOwnPropertyDescriptor(source, property)
      if (descriptor.get || descriptor.set) {
        Object.defineProperty(target, property, Object.assign({
          configurable: true
        }, descriptor))
      } else if (descriptor.hasOwnProperty('value')) {
        target[property] = descriptor.value
      }
    }

    return target
  }
}

module.exports = Extend
