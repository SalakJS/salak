const { RestController } = require('../../../../../..')

class Index extends RestController {
  async actionIndex () {
    this.send('list', 200)
  }

  async actionCreate () {
    this.send(this.body, 201)
  }

  async actionShow (id) {
    this.send(`GET ${id}`, 200)
  }

  async actionReplace (id) {
    this.send(`PUT ${id}`, 201)
  }

  async actionUpdate (id) {
    this.send(`PATCH ${id}`, 201)
  }

  async actionDestroy (id) {
    this.status = 204
  }
}

module.exports = Index
