const Koa = require('koa')
const salakLogger = require('salak-logger')
const is = require('is-type-of')
const assert = require('assert')
const http = require('http')
const fse = require('fs-extra')
const path = require('path')
const pkg = require('../package.json')
const Loader = require('./loader')

const SERVICES_CACHE = Symbol('salak#servicesCache')
const START_PROMISES = Symbol('salak#closePromises')
const CLOSE_PROMISES = Symbol('salak#closePromises')
const HANDLE_EXCEPTION = Symbol('salak#handleException')
const ISCLOSED = Symbol('salak#isClosed')

class Salak extends Koa {
  /**
   * @constructor
   * @param {Object} options
   * @param {String} options.baseDir - application directory, default `process.pwd()`
   * @param {Object} options.opts - options for application
   * @param {String} options.opts.root - root module directory name, default `common`
   * @param {String} options.opts.runtime - directory for storing config, swagger when app is running, default `baseDir + 'runtime'`
   */
  constructor ({ baseDir = process.cwd(), opts }) {
    assert(fse.existsSync(baseDir), `Directory ${baseDir} not exists`)
    assert(fse.statSync(baseDir).isDirectory(), `Directory ${baseDir} is not a directory`)

    super()

    this[SERVICES_CACHE] = new Map()
    this[START_PROMISES] = new Set()
    this[CLOSE_PROMISES] = new Set()
    this[ISCLOSED] = false

    opts = Object.assign({}, {
      root: 'common',
      runtime: path.join(baseDir, 'runtime')
    }, opts)

    this.baseDir = baseDir
    this.root = opts.root
    this.runtime = opts.runtime
    this.runtime && fse.ensureDirSync(this.runtime)

    this.loader = new Loader(this)
    this.loader.loadConfig()

    this.logger = salakLogger(this.config('logger'), this)
    this.logger.info(`Salak version: ${this.version}`)
    this.logger.info(`Enviroment: ${this.env}`)

    this.loader.loadData()

    this[HANDLE_EXCEPTION] = this[HANDLE_EXCEPTION].bind(this)
    this.on('error', this[HANDLE_EXCEPTION])
    process.on('unhandledRejection', this[HANDLE_EXCEPTION])

    this.beforeClose(() => {
      process.removeListener('unhandledRejection', this[HANDLE_EXCEPTION])
    })
  }

  beforeStart (fn) {
    if (fn) {
      assert(is.function(fn), 'fn in salak.beforeStart must be a function.')

      return this[START_PROMISES].add(fn())
    }

    const promisesFn = Array.from(this[START_PROMISES])
    if (!promisesFn.length) {
      return Promise.resolve(true)
    }

    // refactor: compatible jest timeout
    const promises = Promise.all(promisesFn)
    const timeout = this.config('readyTimeout')
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.emit('ready_timeout')
        reject(new Error(`Salak:ready_timeout ${Math.floor(timeout / 1000)} seconds later was still unable to start.`))
      }, timeout)

      promises.then(() => {
        timer && clearTimeout(timer)
        resolve(true)
      }).catch((err) => {
        timer && clearTimeout(timer)
        reject(err)
      })
    })
  }

  [HANDLE_EXCEPTION] (err) {
    this.logger.error(err)
  }

  async close () {
    if (this[ISCLOSED]) {
      return
    }

    this[ISCLOSED] = true
    const promisesFn = Array.from(this[CLOSE_PROMISES])

    // reverse close fn, register first, last emit
    await Promise.all(promisesFn.reverse().map((fn) => fn()))

    this[CLOSE_PROMISES].clear()
    this.emit('close')
    this.removeAllListeners()
  }

  beforeClose (fn) {
    if (fn) {
      assert(is.function(fn), 'fn in salak.beforeClose must be a function.')
      this[CLOSE_PROMISES].add(fn)
    }
  }

  async callback () {
    await this.beforeStart()

    this.loader.loadAll()

    this.emit('ready')
    return super.callback()
  }

  async listen (...args) {
    const server = http.createServer(await this.callback())
    return server.listen(...args)
  }

  async run (port = process.env.PORT || this.config('port') || 3000) {
    const callback = await this.callback()

    const createServerFn = this.config('createServer')
    const server = is.function(createServerFn) ? createServerFn(callback) : http.createServer(callback)

    server.on('error', this[HANDLE_EXCEPTION])
    server.on('listening', () => {
      this.logger.info(`Server running at ${this.config('host') || 'http://127.0.0.1'}:${port}`)
    })

    server.listen(port)
    return server
  }

  config (name, module = this.root) {
    const config = this.configs[module] || {}
    return config[name]
  }

  setConfig (name, value, module = this.root) {
    if (module === this.root) { // set config to all module
      for (let key in this.configs) {
        this.configs[key][name] = value
      }

      return
    }

    const config = this.configs[module]
    if (config) {
      config[name] = value
    }
  }

  service (name, module = this.root, ...args) {
    const key = `${module}-${name}_${JSON.stringify(args)}`
    let instance = this[SERVICES_CACHE].get(key)

    if (!instance) {
      const services = this.services[module]

      const Cls = services[name]

      if (!Cls || !is.class(Cls)) {
        throw new Error(`unknow service: ${name}`)
      }

      instance = new Cls(this, module, ...args)
      this[SERVICES_CACHE].set(key, instance)
    }

    return instance
  }

  get version () {
    return pkg.version
  }
}

Salak.Service = require('./core/service')
Salak.Controller = require('./core/controller')
Salak.RestController = require('./core/rest_controller')
Salak.Behavior = require('./core/behavior')
Salak.Schedule = require('./core/schedule')
Salak.Joi = require('salak-router').Joi

module.exports = Salak
