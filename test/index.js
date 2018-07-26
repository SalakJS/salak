const Salak = require('..')

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
