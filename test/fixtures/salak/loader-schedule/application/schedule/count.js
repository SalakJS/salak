const { Schedule } = require('../../../../../..')

class Count extends Schedule {
  static get timer () {
    return {
      immediate: true
    }
  }

  async run () {
    if (this.app.counter === undefined) {
      this.app.counter = 0
      return
    }

    this.app.counter++
  }
}

module.exports = Count
