const is = require('is-type-of')
const LoaderInterface = require('./loader_interface')
const sysPlugins = require('../config/plugin')

class Plugin extends LoaderInterface {
  load () {
    const plugins = sysPlugins.concat(this.app.config('plugin') || [])

    if (!plugins) {
      return
    }

    this.app.logger.debug('Load Plugins')
    for (let plugin of plugins) {
      const { name } = plugin
      const options = this.app.config(name)

      if (options && options.enable === false) {
        continue
      }

      this.app.logger.debug(`Add plugin: ${name}`)

      let extendObj = plugin.package

      if (is.string(extendObj)) {
        extendObj = require(extendObj)
      }

      if (is.function(extendObj)) {
        extendObj = extendObj(options, this.app)
      }

      this.app.loader.loadExtend(extendObj)
    }

    return plugins
  }
}

module.exports = Plugin
