import { not } from 'fp-ts/lib/Predicate'
import { isEmpty } from 'fp-ts/lib/string'
import type { ValidationError } from 'io-ts'

export const getPath = (error: ValidationError) => {
  const keys = error.context.map(({ key }) => key).filter(not(isEmpty))
  return keys.reduce((string: string, item: string) => {
    var prefix = string === '' ? '' : '.'
    return string + (isNaN(Number(item)) ? prefix + item : '[' + item + ']')
  }, '')
}
