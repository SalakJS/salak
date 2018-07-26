const extend = require('extend')
const assert = require('assert')
const yaml = require('yamljs')
const path = require('path')
const debug = require('debug')('salak:config')
const LoaderInterface = require('./loader_interface')
const util = require('../util')
const constants = require('../util/constants')
const defaults = require('../config/default')

class Config extends LoaderInterface {
  load () {
    const { baseDir, root, env } = this.app
    const configs = {
      [root]: defaults(this.app)
    }

    const files = [
      'default',
      `${env}`,
      '.local'
    ]

    const rootPath = path.join(baseDir, root)

    this._loadModuleFiles(configs[root], rootPath, files)
    this.writeRuntimeFile(path.join('config', `${root}.js`), configs[root])

    const { bootstraps = [] } = configs[root]
    const modules = this._parseBootstraps(bootstraps, baseDir)

    for (let key in modules) {
      assert(key !== root, `module name [${key}] cannot be the same as common module.`)

      configs[key] = {}
      for (let configKey in configs[root]) {
        if (constants.FORBIDDEN_ASSIGN_PROPERTIES.indexOf(configKey) !== -1) {
          continue
        }

        const value = configs[root][configKey]
        if (util.isPlainObject(value)) {
          configs[key][configKey] = extend(true, {}, value)
          continue
        }

        configs[key][configKey] = value
      }

      this._loadModuleFiles(configs[key], modules[key], files)
      this.writeRuntimeFile(path.join('config', `${key}.js`), configs[key])
    }

    modules[root] = rootPath
    debug(`All Configs: ${JSON.stringify(configs)}`)

    return {
      modules,
      mode: Object.keys(modules).length === 1 ? constants.MODE_SINGLE : constants.MODE_MULTIPLE,
      configs
    }
  }

  _parseBootstraps (bootstraps, baseDir) {
    const modules = {}
    for (let bootstrap of bootstraps) {
      if (typeof bootstrap === 'string') {
        modules[bootstrap] = path.join(baseDir, bootstrap)
      } else if (typeof bootstrap === 'object') {
        for (let key in bootstrap) {
          modules[key] = bootstrap[key]
        }
      }
    }

    return modules
  }

  _loadModuleFiles (target, dir, files) {
    debug(`load config from module: ${dir}`)
    const targetDir = path.join(dir, 'config')
    for (let file of files) {
      const obj = this._loadConfigFile(targetDir, file)

      if (!obj) {
        continue
      }

      for (let key in obj) {
        if (util.isPlainObject(obj[key])) {
          target[key] = extend(true, target[key] || {}, obj[key])
          continue
        }

        target[key] = obj[key]
      }
    }
  }

  /**
   * load config file which can be .js or .yml
   */
  _loadConfigFile (dir, filename) {
    let content = util.loadFile(path.join(dir, `${filename}.js`), true)

    if (!content) { // load yaml
      content = util.loadFile(path.join(dir, `${filename}.yml`), true)
      content = (content && yaml.parse(content)) || {}
    }

    return this.injectApp(content)
  }
}

module.exports = Config
