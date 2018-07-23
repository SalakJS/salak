const LoaderInterface = require('./loader_interface')
const assert = require('assert')
const is = require('is-type-of')
const SalakSchedule = require('salak-schedule')

class Schedule extends LoaderInterface {
  load () {
    const { schedules } = this.app

    const { enable, prefix, store, storeOptions } = this.app.config('schedule')
    if (enable === false) {
      return { // mock schedules
        runSchedule () {},
        getSchedules () {
          return {}
        }
      }
    }

    let Store = store
    if (is.string(store)) {
      Store = SalakSchedule.stores[store]
    }

    assert(is.class(Store), 'Schedule store must be class or string which be provided from `salak-schedule`: memory or redis')

    this.app.logger.debug('Load Schedules')

    const timerHandler = new SalakSchedule({
      app: this.app,
      prefix,
      store: new Store(storeOptions)
    })

    this.app.beforeClose(() => {
      timerHandler.close()
    })

    for (let mod in schedules) {
      const modSchedules = schedules[mod]

      for (let key in modSchedules) {
        const Cls = modSchedules[key]

        const timer = is.function(Cls['timer']) ? Cls['timer']() : (Cls['timer'] || {})
        const scheduleKey = `${mod}.${key}`
        if (timer.enable === false) {
          this.app.logger.debug(`Schedule: ${scheduleKey} is disabled.`)
          continue
        }

        this.app.logger.debug(`Add Schedule: ${scheduleKey}`)
        const instance = new Cls(this.app, mod)
        timerHandler.handler(scheduleKey, timer, async () => {
          await instance.run()
        })
      }
    }

    return {
      getSchedules () {
        return timerHandler.getSchedules()
      },
      runSchedule (key) {
        return timerHandler.runSchedule(key)
      }
    }
  }
}

module.exports = Schedule
