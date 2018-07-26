const path = require('path')
const Salak = require('../..')

module.exports = {
  createApp (name, options) {
    const baseDir = path.join(__dirname, 'salak', name)

    return new Salak({
      baseDir
    })
  }
}
