const { Behavior, Joi } = require('../../../../../..')

class Test extends Behavior {
  getNameJoi () {
    return Joi.string().required()
  }
}

module.exports = Test
