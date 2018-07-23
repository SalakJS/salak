const assert = require('assert')
const globby = require('globby')
const fse = require('fs-extra')
const path = require('path')
const is = require('is-type-of')
const debug = require('debug')('salak:util')

const EXTENSIONS = ['.js', '.json', '.node']

module.exports = {
  /**
   * require the file
   *
   * @param {String} filepath
   * @param {Boolean} safe - When set to false, throw error if file is not existed. Otherwise, catch the error.
   */
  loadFile (filepath, safe) {
    debug(`load file: ${filepath}`)

    try {
      const ext = path.extname(filepath)
      if (!(ext && EXTENSIONS.indexOf(ext) !== -1)) {
        return fse.readFileSync(filepath, 'utf-8')
      }

      const obj = require(filepath)

      if (obj && obj.__esModule) {
        let ret = is.nullOrUndefined(obj.default) ? {} : obj.default

        if (!(is.primitive(ret) || is.array(ret))) { // not primitive && array
          for (let key in obj) {
            if (key === 'default') {
              continue
            }

            ret[key] = obj[key]
          }
        }

        return ret
      }

      return obj
    } catch (err) {
      if (safe) {
        return null
      }

      err.message = `[salak] load file: ${filepath}, error: ${err.message}`
      throw err
    }
  },

  /**
   * parse files from directory
   *
   * @param {String} options.directory
   * @param {String|Array} options.match
   * @param {String|Array} options.ignore
   * @param {Function} options.call - if set, trigger when load the file
   * @return {Object} - a.b.c => fn
   */
  loadDir ({
    directory,
    match = ['**/*.js'],
    ignore,
    call
  } = {}) {
    assert(directory, 'options.directory is required.')
    debug(`load directory: ${directory}`)

    const filesObj = {}

    let files = match

    if (!Array.isArray(files)) {
      files = [files]
    }

    if (ignore) {
      if (Array.isArray(ignore)) {
        files = files.concat(ignore)
      } else {
        files.push(ignore)
      }
    }

    const filepaths = globby.sync(files, { cwd: directory })
    for (let item of filepaths) {
      const properties = item.substring(0, item.lastIndexOf('.')).split(/\/|\\/).filter((str) => str !== '').map((str) => { // camelStyle
        str = str.replace(/[_-][a-z]/ig, (s) => s.substring(1).toUpperCase())
        return `${str[0].toLowerCase()}${str.substring(1)}`
      }).join('.')

      const fileObj = this.loadFile(path.join(directory, item))

      if (call) {
        filesObj[properties] = call(fileObj)
        continue
      }

      filesObj[properties] = fileObj
    }

    return filesObj
  }
}
