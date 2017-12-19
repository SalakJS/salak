const Controller = require('../../..').Controller
const Joi = require('../../..').Joi

class Post extends Controller {
  static behaviors () {
    return {
      rules: {
        index: {
          validate: {
            query: {
              id: Joi.number().required()
            }
          }
        }
      }
    }
  }

  actionIndex () {
    this.ctx.body = 'hi, index.'
  }
}

module.exports = Post
