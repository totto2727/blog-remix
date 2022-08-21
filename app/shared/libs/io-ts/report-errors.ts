import { array, option } from 'fp-ts'
import { pipe } from 'fp-ts/lib/function'
import type { Option } from 'fp-ts/lib/Option'
import { not } from 'fp-ts/lib/Predicate'
import { isEmpty } from 'fp-ts/lib/string'
import type { Errors, ValidationError } from 'io-ts'

const getPath = (error: ValidationError) => {
  const keys = error.context.map(({ key }) => key).filter(not(isEmpty))
  return keys.reduce((string: string, item: string) => {
    var prefix = string === '' ? '' : '.'
    return string + (isNaN(Number(item)) ? prefix + item : '[' + item + ']')
  }, '')
}

export const reportErrors = (v: Errors): Record<string, Option<string>> => {
  return pipe(
    v,
    array.map(
      (x) =>
        [
          getPath(x),
          pipe(x.message ?? '', option.fromPredicate(not(isEmpty))),
        ] as const
    ),
    Object.fromEntries
  )
}
