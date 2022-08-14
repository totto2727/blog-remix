import { isRight } from 'fp-ts/lib/Either'
import type { Type } from 'io-ts'

export const createValidateCodec =
  <T>(codec: Type<T>) =>
  (x: unknown): x is T =>
    isRight(codec.decode(x))
