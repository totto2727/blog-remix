import type { Branded, Type } from 'io-ts'
import { brand, string } from 'io-ts'
import { NonEmptyString, withMessage } from 'io-ts-types'

interface NonEmptyStringStrictBrand {
  readonly NonEmptyStringStrict: unique symbol
}
type NonEmptyStringStrict = Branded<NonEmptyString, NonEmptyStringStrictBrand>
interface NonEmptyStringStrictC
  extends Type<NonEmptyStringStrict, string, unknown> {}

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const NonEmptyStringStrict: NonEmptyStringStrictC = withMessage(
  brand(
    NonEmptyString,
    (n): n is NonEmptyStringStrict => n.trim() === n,
    'NonEmptyStringStrict'
  ),
  () => '1文字以上入力が必要です。'
)
