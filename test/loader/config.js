const tools = require('../fixtures/tools')

describe('test/loader/config.js', () => {
  let app
  beforeAll(() => {
    app = tools.createApp('loader-config', { app: 'src', root: 'common' })
  })

  afterAll(async () => {
    await app.close()
  })

  describe('it can load yaml', () => {
    it('can get config `languages`', () => {
      expect(app.config('languages')).toEqual(['NodeJS', 'Java', 'PHP'])
    })
  })

  describe('it can load different env', () => {
    it('can get config `test`', () => {
      expect(app.config('test')).toBe('test')
    })
  })

  describe('it can load different module config', () => {
    it('can get config `test`', () => {
      expect(app.config('test', 'user')).toBe('user')
    })
  })

  describe('function module config extends common config', () => {
    it('can get config `languages`', () => {
      expect(app.config('languages', 'user')).toEqual(['NodeJS', 'Java', 'PHP'])
    })

    it('can get config `tools`', () => {
      expect(app.config('tools', 'user')).toEqual({ jest: 'jest', eslint: 'eslint' })
    })
  })

  describe('config can inject by app', () => {
    it('should return `config`', () => {
      expect(app.config('inject', 'user')).toBe('common')
    })
  })
})
