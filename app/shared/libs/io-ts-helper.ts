import { array, option } from 'fp-ts'
import { fold, isRight } from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/function'
import type { Option } from 'fp-ts/lib/Option'
import { foldW } from 'fp-ts/lib/Option'
import { not } from 'fp-ts/lib/Predicate'
import { isEmpty } from 'fp-ts/lib/string'
import * as t from 'io-ts'
import { NonEmptyString, withMessage } from 'io-ts-types'
import { PathReporter } from 'io-ts/lib/PathReporter'
import invariant from 'tiny-invariant'

export const createTypeChecker =
  <T>(typeC: t.Type<T>) =>
  (x: unknown): x is T =>
    isRight(typeC.decode(x))

type InvariantCodec = <T, O = T>(
  codec: t.Type<T, O, unknown>,
  x: unknown
) => asserts x is O
export const invariantCodec: InvariantCodec = (codec, x) => {
  const validation = codec.decode(x)
  invariant(isRight(validation), PathReporter.report(validation).join('\n'))
}

const getPath = (error: t.ValidationError) =>
  error.context
    .map(({ key }) => key)
    .filter(not(isEmpty))
    .join('.')

const getReportRecord = <A>(
  v: t.Validation<A>
): Partial<Record<string, Option<string>>> => {
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

export class Validator<A extends t.Props> {
  private _codec: t.TypeC<A>
  private _validation: t.Validation<t.TypeOf<t.TypeC<A>>> | undefined

  constructor(codec: t.TypeC<A>) {
    this._codec = codec
  }

  validate = (x: unknown): x is t.TypeOf<t.TypeC<A>> => {
    this._validation = this._codec.decode(x)
    return isRight(this._validation)
  }

  get error() {
    if (this._validation) return getReportRecord(this._validation)
    else return {}
  }
}

interface INonEmptyStringStrict {
  readonly NonEmptyStringStrict: unique symbol
}
export const NonEmptyStringStrict = withMessage(
  t.brand(
    NonEmptyString,
    (n): n is t.Branded<NonEmptyString, INonEmptyStringStrict> =>
      n.trim() === n,
    'NonEmptyStringStrict'
  ),
  () => '1文字以上入力が必要です。'
)
