const { Behavior } = require('../../../../../..')

class Index extends Behavior {
  actionIndex () {
    return {
      validate: {
        query: {
          id: this.Joi.number().required()
        }
      }
    }
  }

  actionName () {
    return {
      validate: {
        query: {
          name: this.behavior('test').getNameJoi()
        }
      }
    }
  }
}

module.exports = Index
