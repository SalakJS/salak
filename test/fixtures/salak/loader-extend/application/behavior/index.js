const { Behavior } = require('../../../../../..')

class Index extends Behavior {
  actionBehavior () {
    return {
      validate: {
        query: {
          version: this.isNumber
        }
      }
    }
  }
}

module.exports = Index
