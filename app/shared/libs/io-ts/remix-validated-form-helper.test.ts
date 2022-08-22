import { describe, expect, it } from 'vitest'
import { t } from '.'
import { getReportRecord, withIoTs } from './remix-validated-form-helper'

const remixValidatedFormValidationResult = <T, U>(
  result: 'right' | 'left',
  data: T,
  error: U
) => ({
  data: result === 'right' ? data : undefined,
  error:
    result === 'left'
      ? { fieldErrors: error, formId: undefined, subaction: undefined }
      : undefined,
  formId: undefined,
  submittedData: data,
})

describe('getReportRecord', () => {
  it('right', () => {
    const expected = { a: '' }
    const codec = t.type({ a: t.string })
    const validation = codec.decode(expected)
    const actual = getReportRecord(validation)
    expect(actual).toStrictEqual({})
  })
  it('left simple', () => {
    const expected = { a: '' }
    const codec = t.type({ a: t.string, b: t.string })
    const validation = codec.decode(expected)
    const actual = getReportRecord(validation)
    expect(actual).toStrictEqual({ b: '' })
  })
  it('left nested', () => {
    const expected = { a: { b: 1 } }
    const codec = t.type({ a: t.type({ b: t.string }) })
    const validation = codec.decode(expected)
    const actual = getReportRecord(validation)
    expect(actual).toStrictEqual({ 'a.b': '' })
  })
  it('left nested array', () => {
    const expected = { a: { b: [1] } }
    const codec = t.type({ a: t.type({ b: t.array(t.string) }) })
    const validation = codec.decode(expected)
    const actual = getReportRecord(validation)
    expect(actual).toStrictEqual({ 'a.b[0]': '' })
  })
})

describe('withIoTs', () => {
  it('right', async () => {
    const codec = t.type({
      type: t.literal('bar'),
      bar: t.string,
    })
    const expected = remixValidatedFormValidationResult(
      'right',
      { type: 'bar', bar: '123' },
      undefined
    )
    const actual = await withIoTs(codec).validate(expected.submittedData)
    expect(actual).toStrictEqual(expected)
  })
  it('left nested array', async () => {
    const codec = t.type({ a: t.array(t.type({ b: t.string })) })
    const expected = remixValidatedFormValidationResult(
      'left',
      { a: [{ b: 1 }] },
      { 'a[0].b': '' }
    )
    const actual = await withIoTs(codec).validate(expected.submittedData)

    expect(actual).toStrictEqual(expected)
  })
})
