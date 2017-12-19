const SalakCore = require('salak-core')
const defaultOutput = require('../lib/output')
const path = require('path')

class Controller extends SalakCore.Controller {
  async render (name, variables, module = this.module) {
    const moduleDir = this.app.modules[this.module] || path.join(this.app.baseDir, this.app.root)
    const view = path.join(moduleDir, 'view', name)

    await this.ctx.render(view, variables)
  }

  sendJson (code, msg, data) {
    const output = this.app.output || defaultOutput
    this.ctx.body = output(code, msg, data)
  }

  send (status = 200, body) {
    this.ctx.status = status
    this.ctx.body = body
  }
}

module.exports = Controller
