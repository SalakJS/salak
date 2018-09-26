const { Schedule } = require('../../../../../..')

class Test extends Schedule {
  static get timer () {
    return {
      immediate: true
    }
  }

  async run () {
    this.app.testSchedule = this.say('salak')
  }
}

module.exports = Test
