const tools = require('../fixtures/tools')

describe('test/loader/schedule.js', () => {
  let app
  beforeAll(async () => {
    app = tools.createApp('loader-schedule')
    await app.callback()
  })

  afterAll(async () => {
    await app.close()
  })

  describe('trigger `once` timer', () => {
    it('should get `once` true', () => {
      expect(app.one).toBe(true)
    })
  })

  describe('options.enable === false', () => {
    it('can not run `status` timer', () => {
      expect(app.timerStatus).toBeUndefined()
    })
  })

  describe('app.schedule.getSchedules()', () => {
    it('should return schedule numbers', () => {
      expect(Object.keys(app.schedule.getSchedules()).length).toBe(2)
    })
  })

  describe('app.schedule.runSchedule()', () => {
    it('should return `1`', async () => {
      app.schedule.runSchedule('application.count')
      await tools.sleep(10)
      expect(app.counter).toBe(1)
    })
  })
})
