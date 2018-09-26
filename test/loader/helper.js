const tools = require('../fixtures/tools')

describe('test/loader/helper.js', () => {
  let app
  beforeAll(async () => {
    app = tools.createApp('loader-helper')
  })

  afterAll(async () => {
    await app.close()
  })

  describe('helper can load multi helper file', () => {
    it('should return `random`', () => {
      expect(app.helper.lodash.random()).toBe('random')
    })

    it('should return `mixin`', () => {
      expect(app.helper.lodash.mixin()).toBe('mixin')
    })

    it('should return `noop`', () => {
      expect(app.helper.noop()).toBe('noop')
    })
  })

  describe('helper can inject app', () => {
    it('should return `inject_application`', () => {
      expect(app.helper.inject).toBe('inject_application')
    })
  })
})
