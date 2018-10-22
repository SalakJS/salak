const Base = require('./base')
const is = require('is-type-of')

class Behavior extends Base {
  static get routes () {
    return {}
  }

  behavior (name, module = this.module) {
    const { behaviors } = this.app
    const Cls = behaviors[module] && behaviors[module][name]

    if (!is.class(Cls)) {
      throw new Error(`behavior ${name} must be class.`)
    }

    return new Cls(this.app, module)
  }
}

module.exports = Behavior
