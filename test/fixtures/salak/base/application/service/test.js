const { Service } = require('../../../../../..')

class Test extends Service {
  getTestName () {
    return 'service'
  }
}

module.exports = Test
