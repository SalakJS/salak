const { Schedule } = require('../../../../../..')

class Status extends Schedule {
  static get timer () {
    return {
      enable: false,
      immediate: true
    }
  }

  async run () {
    this.app.timerStatus = true
  }
}

module.exports = Status
