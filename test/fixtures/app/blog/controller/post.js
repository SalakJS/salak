const { Controller, Joi, makeOutputSchema } = require('../../../../..')

class Post extends Controller {
  constructor (...args) {
    super(...args)
    this.middleware('auth').only('index')
  }

  static behaviors () {
    return {
      rules: {
        index: {
          meta: {
            summary: '查看文章',
            description: '获取文章详情'
          },
          validate: {
            query: {
              id: Joi.number().required()
            },
            responses: {
              200: {
                body: makeOutputSchema({
                  username: Joi.string().required()
                })
              }
            }
          }
        }
      }
    }
  }

  actionIndex () {
    this.sendJson('0', 'ok', { username: 'wengeek' })
  }
}

module.exports = Post
