import type { Validator } from 'remix-validated-form'
import { createValidator } from 'remix-validated-form'
import { array } from 'fp-ts'
import { fold, isRight } from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/function'
import { fromEntries } from 'fp-ts/lib/ReadonlyRecord'
import type { Mixed, TypeOf, Validation } from 'io-ts'
import { getPath } from './getPath'

export const getReportRecord = <A>(
  v: Validation<A>
): Record<string, string> => {
  return pipe(
    v,
    fold(
      array.map((x) => [getPath(x), x.message ?? ''] as const),
      () => []
    ),
    fromEntries
  )
}

export const withIoTs = <T extends Mixed>(codec: T): Validator<TypeOf<T>> =>
  createValidator({
    validate: async (unvalidatedData) => {
      const validation = codec.decode(unvalidatedData)
      if (isRight(validation))
        return { data: validation.right, error: undefined }
      else return { data: undefined, error: getReportRecord(validation) }
    },
    validateField: async (unvalidatedData, field) => {
      const validation = codec.decode(unvalidatedData)
      if (isRight(validation)) return {}
      else return { error: getReportRecord(validation)[field] ?? '' }
    },
  })
