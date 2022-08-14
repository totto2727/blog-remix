import { it, describe, expect } from 'vitest'
import * as t from 'io-ts'
import { getReportRecord } from './codec-validator'
import { CodecValidator, NonEmptyStringStrict } from '.'

describe('getReportRecord', () => {
  it('right', () => {
    const input = { a: '' }
    const codec = t.type({ a: t.string })
    const actual = getReportRecord(codec.decode(input))
    expect(actual).toStrictEqual({})
  })
  it('left simple', () => {
    const input = { a: '' }
    const codec = t.type({ a: NonEmptyStringStrict, b: t.string })
    const actual = getReportRecord(codec.decode(input))
    expect(actual['a']).toBeSome()
    expect(actual['b']).toBeNone()
  })
  it('left nested', () => {
    const input = { a: { b: 1 } }
    const codec = t.type({ a: t.type({ b: t.string }) })
    const actual = getReportRecord(codec.decode(input))
    expect(actual['a.b']).toBeNone()
  })
  it('left nested array', () => {
    const input = { a: { b: [1] } }
    const codec = t.type({ a: t.type({ b: t.array(t.string) }) })
    const actual = getReportRecord(codec.decode(input))
    expect(actual['a.b[0]']).toBeNone()
  })
})

describe('CodecValidator', () => {
  it('right', async () => {
    const input = {
      type: 'bar',
      bar: '',
    }
    const codec = t.type({
      type: t.literal('bar'),
      bar: t.string,
    })
    const validator = new CodecValidator(codec)
    const actual = validator.validate(input)
    expect(actual).toBeTruthy()
  })
  it('left', async () => {
    const input = { a: [{ b: 1 }] }
    const codec = t.type({ a: t.array(t.type({ b: t.string })) })
    const validator = new CodecValidator(codec)
    expect(validator.validate(input)).toBeFalsy()
    expect(validator.error['a[0].b']).toBeNone()
  })
})
