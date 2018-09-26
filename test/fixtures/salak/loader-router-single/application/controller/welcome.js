const { Controller } = require('../../../../../..')

class Welcome extends Controller {
  async actionIndex () {
    this.send('welcome')
  }

  async actionSay (name) {
    this.send(name)
  }
}

module.exports = Welcome
