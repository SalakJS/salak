const { Controller } = require('../../../../../../..')

class Login extends Controller {
  async actionIndex () {
    return {
      a: this.ctx.a,
      b: this.ctx.b
    }
  }
}

module.exports = Login
