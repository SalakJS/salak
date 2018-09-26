const { Controller } = require('../../../../../../..')

class Comment extends Controller {
  async actionIndex () {
    return 'comment'
  }
}

module.exports = Comment
