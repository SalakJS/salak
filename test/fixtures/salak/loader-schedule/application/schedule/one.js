const { Schedule } = require('../../../../../..')

class One extends Schedule {
  static get timer () {
    return {
      immediate: true
    }
  }

  async run () {
    this.app.one = true
  }
}

module.exports = One
