const Controller = require('../../..').RestController
const Joi = require('../../..').Joi

class Post extends Controller {
  static behaviors () {
    return {
      rules: {
        index: {
          meta: {
            summary: '概要',
            description: '查看评论',
            tags: ['Comment']
          },
          validate: {
            responses: {
              200: {
                body: {
                  code: Joi.number().required()
                }
              }
            }
          }
        }
      }
    }
  }

  actionShow (id) {
    this.sendJson(id, 'ok', { user: 'wengeek' })
  }

  actionIndex () {
    this.sendJson('12', 'ok', { user: 'wengeek' })
  }
}

module.exports = Post
