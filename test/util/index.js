const util = require('../../lib/util')
const path = require('path')

describe('test/util/index.js', () => {
  const dir = path.join(__dirname, '../fixtures/util')
  describe('test loadFile', () => {
    const objectFile = path.join(dir, 'object.js')
    const notFoundFile = path.join(dir, 'not_found.js')
    const esModuleFile = path.join(dir, 'es_module.js')
    const esModuleWithPrimitiveFile = path.join(dir, 'es_module_primitive.js')
    const esModuleWithNullFile = path.join(dir, 'es_module_null.js')
    const esModuleWithArrayFile = path.join(dir, 'es_module_array.js')
    const notJsFile = path.join(dir, 'not_js.yml')

    it('should load data', () => {
      expect(util.loadFile(objectFile)).toStrictEqual({
        test: 'test'
      })
      expect(util.loadFile(esModuleFile)).toStrictEqual({
        es: 'es',
        context: 'context'
      })
      expect(util.loadFile(esModuleWithPrimitiveFile)).toBe('es')
      expect(util.loadFile(esModuleWithNullFile)).toStrictEqual({
        context: 'context'
      })
      expect(util.loadFile(esModuleWithArrayFile)).toEqual([1, 2, 3])
    })

    it('should throw error when file is not existed and safe options is not be set to true', () => {
      expect(util.loadFile(notFoundFile, true)).toBeNull()
      expect(() => {
        util.loadFile(notFoundFile)
      }).toThrow('Cannot find module')
    })

    it('should load not js file', () => {
      expect(util.loadFile(notJsFile).toString()).toBe('- test\n')
    })
  })

  describe('test loadDir', () => {
    const directory = path.join(dir, 'directory')

    it('should load filesObj', () => {
      expect(() => {
        util.loadDir()
      }).toThrow('options.directory is required.')
      expect(Object.keys(util.loadDir({
        directory
      }))).toEqual(expect.arrayContaining(['child.node', 'index', 'oneTest']))
      expect(Object.keys(util.loadDir({
        directory,
        match: '*.js'
      }))).toEqual(expect.arrayContaining(['index', 'oneTest']))
      expect(Object.keys(util.loadDir({
        directory,
        match: ['*.js']
      }))).toEqual(expect.arrayContaining(['index', 'oneTest']))
      expect(Object.keys(util.loadDir({
        directory,
        ignore: '!index.js'
      }))).toEqual(expect.arrayContaining(['child.node', 'oneTest']))
      expect(Object.keys(util.loadDir({
        directory,
        ignore: ['!index.js']
      }))).toEqual(expect.arrayContaining(['child.node', 'oneTest']))
    })

    it('should call fn', () => {
      expect(util.loadDir({
        directory,
        call: (fn) => {
          if (typeof fn === 'function') {
            return fn({
              fn: 'call'
            })
          }

          return fn
        }
      })).toEqual({
        'index': {},
        'oneTest': {},
        'child.node': {
          fn: 'call'
        }
      })
    })
  })
})
