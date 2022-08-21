import { pipe } from 'fp-ts/lib/function'
import type { Type } from 'io-ts'
import { E } from '../fp-ts'
import { reportErrors } from './report-errors'

export const createCodecValidationReportor =
  <T, U = T>(codec: Type<T, U, unknown>) =>
  (x: unknown) =>
    pipe(x, codec.decode, E.mapLeft(reportErrors))
