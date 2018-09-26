const { Service } = require('../../../../../..')

class Test extends Service {
  sayName () {
    return this.say('salak')
  }
}

module.exports = Test
