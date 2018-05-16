'use strict'

/**
 * 入口文件
 *
 * 创 建 者：wengeek <wenwei897684475@gmail.com>
 * 创建时间：2017-12-19
 */

const SalakCore = require('salak-core')
const middleware = require('./config/middleware')
const HttpClient = require('./lib/httpClient')

const HANDLER_ERROR = Symbol('salak#error')
const HTTP_CLIENT = Symbol('salak#httpClient')

// 重置默认中间件以及加载顺序
SalakCore[SalakCore.defaults] = {
  buildInMiddlewares: middleware.buildInMiddlewares,
  buildInMiddlewaresOrder: middleware.buildInMiddlewaresOrder
}

class Salak extends SalakCore {
  constructor (options) {
    super(options)

    // 注入curl
    this[HTTP_CLIENT] = new HttpClient(this.rootConfig.httpClient)
    this.curl = SalakCore.BaseContext.prototype.curl = (url, options) => {
      return this[HTTP_CLIENT].request(url, options)
    }

    // 容错处理
    // bind _unhandledRejectionHandler
    const errorHandler = this[HANDLER_ERROR].bind(this)
    process.on('unhandledRejection', errorHandler)
    this.on('error', errorHandler)
  }

  [HANDLER_ERROR] (err) {
    this.logger.error(err)
  }
}

Salak.Controller = require('./lib/controller')
Salak.RestController = require('./lib/restController')

Salak.makeOutputSchema = require('./lib/output').makeOutputSchema

module.exports = Salak
