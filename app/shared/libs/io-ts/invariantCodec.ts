import { isRight } from 'fp-ts/lib/Either'
import type { Type } from 'io-ts'
import { PathReporter } from 'io-ts/lib/PathReporter'
import invariant from 'tiny-invariant'

type InvariantCodec = <T, O = T>(
  codec: Type<T, O, unknown>,
  x: unknown
) => asserts x is O
export const invariantCodec: InvariantCodec = (codec, x) => {
  const validation = codec.decode(x)
  invariant(isRight(validation), PathReporter.report(validation).join('\n'))
}
