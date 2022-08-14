import { left, right } from 'fp-ts/lib/Either'
import * as t from 'io-ts'
import { NonEmptyString } from 'io-ts-types'
import { withMessage } from 'io-ts-types'
import isEmail from 'validator/lib/isEmail'
import { CodecValidator } from '~/shared/libs/io-ts'

type IEmail = { readonly Email: unique symbol }
const emailC = t.brand(
  t.string,
  (n): n is t.Branded<NonEmptyString, IEmail> => isEmail(n),
  'Email'
)

export const emailAndPasswordC = t.type({
  email: withMessage(emailC, () => 'メールアドレスを入力してください'),
  password: withMessage(NonEmptyString, () => 'パスワードを入力してください'),
})
export type EmailAndPassword = t.TypeOf<typeof emailAndPasswordC>
const emailAndPasswordValidator = new CodecValidator(emailAndPasswordC)

export const extractEmailAndPasswordFromFormData = (formData: FormData) => {
  const emailAndPassword = {
    email: formData.get('email'),
    password: formData.get('password'),
  }
  if (emailAndPasswordValidator.validate(emailAndPassword)) {
    return right(emailAndPassword)
  } else {
    return left(emailAndPasswordValidator.error)
  }
}
