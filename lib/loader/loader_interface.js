const is = require('is-type-of')
const fse = require('fs-extra')
const path = require('path')
const debug = require('debug')('salak:write-runtime')

class LoaderInterface {
  constructor (app) {
    this.app = app
    this.injectApp = this.injectApp.bind(this)
  }

  injectApp (target) {
    return is.function(target) ? target(this.app) : target
  }

  writeRuntimeFile (file, obj) {
    const { runtime } = this.app

    if (!runtime) {
      debug('disable write runtime file')
      return
    }

    debug(`writing runtime file: ${file}`)
    fse.outputJsonSync(path.join(runtime, file), obj, {
      spaces: 2
    })
  }

  load () {
    throw new Error('Loader.prototype.load must be provided.')
  }
}

module.exports = LoaderInterface
