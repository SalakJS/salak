const path = require('path')
const request = require('supertest')
const fse = require('fs-extra')
const tools = require('./fixtures/tools')
const childProcess = require('child_process')

const tsDirectory = path.join(__dirname, 'fixtures', 'salak', 'ts')
const tsBin = path.join(__dirname, '..', 'node_modules', '.bin', 'tsc')

beforeAll(() => {
  childProcess.execSync(`${tsBin} -p ${path.join(tsDirectory, 'tsconfig.json')}`)
})

afterAll(() => {
  fse.removeSync(path.join(tsDirectory, 'application'))
})

describe('test typescript support', () => {
  let app
  let callback
  beforeAll(async () => {
    app = tools.createApp('ts')
    callback = await app.callback()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should return `salak`', async () => {
    const res = await request(callback).get('/').expect(200)

    expect(res.text).toBe('salak')
  })
})
