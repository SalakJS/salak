const path = require('path')
const is = require('is-type-of')
const LoaderInterface = require('./loader_interface')
const util = require('../util')

class Helper extends LoaderInterface {
  load () {
    const { modules, root } = this.app
    const obj = util.loadDir({
      directory: path.join(modules[root], 'helper'),
      match: ['*.js'],
      call: this.injectApp
    })

    const target = {}

    this.app.logger.debug('Load Helper')

    const defaultHelper = obj['index']
    if (is.object(defaultHelper)) {
      this.app.logger.debug('Add Helper: helper/index.js')
      Object.assign(target, defaultHelper)
    }

    for (let key in obj) {
      if (key === 'index') {
        continue
      }

      this.app.logger.debug(`Add Helper: helper/${key}.js`)

      target[key] = obj[key]
    }

    return target
  }
}

module.exports = Helper
