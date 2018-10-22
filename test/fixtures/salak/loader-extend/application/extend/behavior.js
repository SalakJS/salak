const { Joi } = require('../../../../../..')

module.exports = {
  get isNumber () {
    return Joi.number().required()
  }
}
