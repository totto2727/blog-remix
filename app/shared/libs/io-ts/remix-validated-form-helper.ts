import type { Validator } from 'remix-validated-form'
import { createValidator } from 'remix-validated-form'
import { option, record } from 'fp-ts'
import { pipe, flow } from 'fp-ts/lib/function'
import type { Mixed, TypeOf, Validation } from 'io-ts'
import { reportErrors } from './report-errors'
import { E } from '../fp-ts'

export const getReportRecord = <A>(v: Validation<A>) =>
  pipe(
    v,
    E.fold(
      flow(
        reportErrors,
        record.map(
          option.fold(
            () => '',
            (s) => s
          )
        )
      ),
      () => ({})
    )
  )

export const withIoTs = <T extends Mixed>(codec: T): Validator<TypeOf<T>> =>
  createValidator({
    validate: async (unvalidatedData) => {
      const validation = codec.decode(unvalidatedData)
      if (E.isRight(validation))
        return { data: validation.right, error: undefined }
      else return { data: undefined, error: getReportRecord(validation) }
    },
    validateField: async (unvalidatedData, field) => {
      const validation = codec.decode(unvalidatedData)
      if (E.isRight(validation)) return {}
      else return { error: getReportRecord(validation)[field] ?? '' }
    },
  })
