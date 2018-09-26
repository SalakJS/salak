const path = require('path')
const Salak = require('../..')
const fse = require('fs-extra')

module.exports = {
  createApp (name, { app = '', root = 'application' } = {}) {
    const baseDir = path.join(__dirname, 'salak', name)

    const instance = new Salak({
      baseDir,
      opts: {
        app,
        root
      }
    })

    instance.beforeClose(() => {
      fse.removeSync(path.join(baseDir, 'logs'))
      fse.removeSync(path.join(baseDir, 'runtime'))
    })

    return instance
  },
  sleep (ms) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(true)
      }, ms)
    })
  }
}
