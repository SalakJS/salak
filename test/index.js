'use strict'

const assert = require('assert')
const Salak = require('..')

describe('Salak', () => {
  it('should expose properties', () => {
    assert(Salak)
    assert(Salak.Controller)
    assert(Salak.RestController)
    assert(Salak.Service)
    assert(Salak.BaseContext)
    assert(Salak.Joi)
    assert(Salak.makeOutputSchema)
  })
})
