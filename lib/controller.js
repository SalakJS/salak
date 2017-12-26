'use strict'

/**
 * Controller扩展
 *
 * 创 建 者：wengeek <wenwei897684475@gmail.com>
 * 创建时间：2017-12-19
 */

const SalakCore = require('salak-core')
const defaultOutput = require('../lib/output')
const path = require('path')

class Controller extends SalakCore.Controller {
  /**
   * 渲染视图
   *
   * @param {string} name 视图名称
   * @param {Object} variables 变量
   * @param {string} module 模块名称，默认为当前模块
   */
  async render (name, variables, module = this.module) {
    const moduleDir = this.app.modules[module] || path.join(this.app.baseDir, this.app.root)
    const view = path.join(moduleDir, 'view', name)

    await this.ctx.render(view, variables)
  }

  /**
   * json输出
   *
   * @param {number} code 数据状态码
   * @param {string} msg 接口信息
   * @param {Any} data 数据
   */
  sendJson (code, msg, data) {
    const output = this.app.output || defaultOutput
    this.ctx.body = output(code, msg, data)
  }

  /**
   * 设置status以及body，一般用于rest接口
   *
   * @param {number} status 接口状态
   * @param {Any} body
   */
  send (status = 200, body) {
    this.ctx.status = status
    this.ctx.body = body
  }
}

module.exports = Controller
