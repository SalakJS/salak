const { Service } = require('../../../../../../..')

class Welcome extends Service {
  sayHello () {
    return 'hello'
  }
}

module.exports = Welcome
