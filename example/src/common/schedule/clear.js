const { Schedule } = require('../../../..')

class Clear extends Schedule {
  static get timer () {
    return {
      cron: '*/2 * * * * *'
    }
  }

  async run () {
    this.logger.info('clear data')
  }
}

module.exports = Clear
