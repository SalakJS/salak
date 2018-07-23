const util = require('./util')
const path = require('path')

const GET_LOADER = Symbol('loader#getLoader')
const INSTANCES = Symbol('loader#instances')

class Loader {
  constructor (app) {
    this.app = app
    this[INSTANCES] = new Map()
  }

  loadFiles (modules, property, options = {}) {
    const obj = {}

    for (let key in modules) {
      obj[key] = util.loadDir(Object.assign({
        directory: path.join(modules[key], property)
      }, options))
    }

    return obj
  }

  loadAll () {
    this.app.use(this.loadMiddleware(require('./config/middleware'), 'core'))
    const rootMiddlewares = this.loadMiddleware(this.app.config('middleware'), this.app.root)
    if (rootMiddlewares) {
      this.app.use(rootMiddlewares)
    }

    this.loadRouter()
    this.app.swagger = this[GET_LOADER]('swagger').load()
    this.app.use(this.app.router.routes())
    this.loadSchedule()
  }

  loadRouter () {
    const { router, routesDefinitions } = this[GET_LOADER]('router').load()

    this.app.router = router
    this.app.routesDefinitions = routesDefinitions
  }

  loadExtend (options) {
    this[GET_LOADER]('extend').loadExtend(options)
  }

  loadMiddleware (middlewares, module) {
    return this[GET_LOADER]('middleware').loadMiddleware(middlewares, module)
  }

  loadSchedule () {
    this.app.schedule = this[GET_LOADER]('schedule').load()
  }

  loadConfig () {
    const { modules, mode, configs } = this[GET_LOADER]('config').load()

    this.app.modules = modules
    this.app.mode = mode
    this.app.configs = configs
  }

  // Load data to Salak instance
  loadData () {
    const { modules } = this.app

    this.app.middlewares = this.loadFiles(modules, 'middleware')
    this.app.services = this.loadFiles(modules, 'service')
    this.app.controllers = this.loadFiles(modules, 'controller')
    this.app.behaviors = this.loadFiles(modules, 'behavior')
    this.app.schedules = this.loadFiles(modules, 'schedule')

    // load app ${root}/extend
    this[GET_LOADER]('extend').load()

    this.app.helper = this[GET_LOADER]('helper').load()
    this.app.plugins = this[GET_LOADER]('plugin').load()
    this.app.coreMiddlewares = this[GET_LOADER]('middleware').load()
  }

  [GET_LOADER] (loader) {
    let instance = this[INSTANCES].get(loader)
    if (!instance) {
      const Cls = require(`./loader/${loader}`)
      instance = new Cls(this.app)
      this[INSTANCES].set(loader, instance)
    }

    return instance
  }
}

module.exports = Loader
