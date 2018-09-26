const { Behavior } = require('../../../..')

class Index extends Behavior {
  actionIndex () {
    return {
      meta: {
        summary: 'index action',
        description: 'index action desc'
      },
      validate: {
        query: {
          user: this.Joi.string().required()
        }
      }
    }
  }
}

module.exports = Index
