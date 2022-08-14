import { array, option } from 'fp-ts'
import { fold, isRight } from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/function'
import type { Option } from 'fp-ts/lib/Option'
import { foldW } from 'fp-ts/lib/Option'
import { not } from 'fp-ts/lib/Predicate'
import { isEmpty } from 'fp-ts/lib/string'
import type { Props, TypeC, TypeOf, Validation } from 'io-ts'
import { getPath } from './getPath'

export const getReportRecord = <A>(
  v: Validation<A>
): Record<string, Option<string>> => {
  return pipe(
    v,
    fold(
      array.map(
        (x) =>
          [
            getPath(x),
            pipe(x.message ?? '', option.fromPredicate(not(isEmpty))),
          ] as const
      ),
      () => []
    ),
    Object.fromEntries
  )
}

export const viewErrorMessage = (
  message: Option<string> | undefined,
  empty = 'error'
): string | undefined => {
  if (message) {
    return pipe(
      message,
      foldW(
        () => empty,
        (x) => x
      )
    )
  }
  return message
}

export class CodecValidator<A extends Props> {
  private _codec: TypeC<A>
  private _validation: Validation<TypeOf<TypeC<A>>> | undefined

  constructor(codec: TypeC<A>) {
    this._codec = codec
  }

  validate = (x: unknown): x is TypeOf<TypeC<A>> => {
    this._validation = this._codec.decode(x)
    return isRight(this._validation)
  }

  get error() {
    if (this._validation) return getReportRecord(this._validation)
    else return {}
  }
}
