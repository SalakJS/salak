const tools = require('../fixtures/tools')

describe('test/loader/plugin.js', () => {
  let app
  beforeAll(() => {
    app = tools.createApp('loader-plugin')
  })

  afterAll(async () => {
    await app.close()
  })

  describe('load system plugins', () => {
    it('load curl', async () => {
      expect(app.curl).toBeDefined()
    })

    it('load output', async () => {
      expect(app.outputJson).toBeDefined()
      expect(app.outputErrorHtml(404)).toMatch(/404/)
    })
  })

  describe('load custom plugins', () => {
    it('load `test`', () => {
      expect(app.say('test')).toBe('salak-test')
    })
  })
})
