const path = require('path')
const Salak = require('../..')

module.exports = {
  createApp (name, options) {
    const baseDir = path.join(__dirname, name)

    return new Salak({
      baseDir
    })
  }
}
