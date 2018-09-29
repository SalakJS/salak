const Salak = require('..')
const path = require('path')
const request = require('supertest')
const fse = require('fs-extra')
const tools = require('./fixtures/tools')

afterAll(() => {
  fse.removeSync(path.join(process.cwd(), 'logs'))
  fse.removeSync(path.join(process.cwd(), 'runtime'))
})

describe('test/salak.js', () => {
  let app

  afterEach(async () => {
    if (app) {
      await app.close()
    }
  })

  describe('test/index.js', () => {
    it('should expose properties', () => {
      expect(Salak).toBeDefined()
      expect(Salak.Service).toBeDefined()
      expect(Salak.Controller).toBeDefined()
      expect(Salak.RestController).toBeDefined()
      expect(Salak.Schedule).toBeDefined()
      expect(Salak.Behavior).toBeDefined()
      expect(Salak.Joi).toBeDefined()
    })
  })

  describe('create Salak', () => {
    it('should set root', () => {
      app = new Salak()

      expect(app.root).toBe('common')
    })

    it('should set cwd() when no options', () => {
      const dir = process.cwd()
      app = new Salak()

      expect(app.baseDir).toBe(dir)
      expect(app.appDir).toBe(dir)
      expect(app.runtime).toBe(path.join(dir, 'runtime'))
    })

    it('should throw error when baseDir not exists or not directory', () => {
      expect(() => {
        app = new Salak({
          baseDir: -1
        })
      }).toThrow(/Directory -1 not exists/)

      expect(() => {
        app = new Salak({
          baseDir: __filename
        })
      }).toThrow(`Directory ${__filename} is not a directory`)
    })
  })

  describe('beforeStart', () => {
    it('should get data from beforestart', async () => {
      app = tools.createApp('beforestart')
      const data = { name: 'salak' }
      app.beforeStart(() => {
        app.data = data
      })

      const callback = await app.callback()

      const res = await request(callback).get('/').expect(200)
      expect(res.body.data).toEqual(data)
    })

    it('should trigger ready_timeout when beforeStart timeout', async () => {
      app = tools.createApp('beforestart')
      app.beforeStart(async () => {
        await new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(true)
          }, 1100)
        })
      })

      const mockFn = jest.fn()

      app.on('ready_timeout', mockFn)

      try {
        await app.callback()
      } catch (err) {
        expect(err.message === 'Salak:ready_timeout 1 seconds later was still unable to start.')
      }
      expect(mockFn.mock.calls.length).toBe(1)
    })

    it('should throw error when beforeStart has error', async () => {
      app = tools.createApp('beforestart')
      app.beforeStart(async () => {
        await new Promise((resolve, reject) => {
          reject(new Error('beforestart error'))
        })
      })

      try {
        await app.callback()
      } catch (err) {
        expect(err.message === 'beforestart error')
      }
    })
  })

  describe('app.beforeClose', async () => {
    it('should trigger beforeClose when app.close()', async () => {
      app = new Salak()
      let called = false
      app.beforeClose(() => {
        called = true
      })

      await app.close()
      expect(called).toBe(true)
    })
  })

  describe('app.close()', () => {
    it('should emit close before exit', async () => {
      app = new Salak()
      let called = false
      app.on('close', () => {
        called = true
      })

      await app.close()
      expect(called).toBe(true)
    })
  })

  describe('app.config()', () => {
    it('should return config value', () => {
      app = tools.createApp('config')

      expect(app.config('test')).toBe('test')
    })
  })

  describe('app.setConfig()', () => {
    it('should get config after set config', () => {
      app = tools.createApp('setconfig', { app: 'src', root: 'common' })

      app.setConfig('set-config', 'test')
      app.setConfig('user', 'test-user', 'user')
      expect(app.config('set-config')).toBe('test')
      expect(app.config('user', 'user')).toBe('test-user')
    })
  })

  describe('app.listen()', () => {
    it('should return server', async () => {
      app = tools.createApp('app')

      const server = await app.listen(0)

      const res = await request(server).get('/').expect(200)
      expect(res.body.data).toBe('ok')
      server.close()
    })
  })

  describe('app.run()', () => {
    it('should return server', async () => {
      app = tools.createApp('app')

      const server = await app.run(0)

      const res = await request(server).get('/').expect(200)
      expect(res.body.data).toBe('ok')
      server.close()
    })
  })

  describe('app.service()', () => {
    it('should return source', () => {
      app = tools.createApp('service', { app: 'src', root: 'common' })

      expect(app.service('welcome').sayHello()).toBe('hello')
      expect(app.service('user', 'user').getUser()).toBe('salak')
      expect(() => {
        app.service('unknow')
      }).toThrow('unknow')
    })
  })
})
