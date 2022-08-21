import * as t from 'io-ts'
import { NonEmptyString } from 'io-ts-types'
import { withMessage } from 'io-ts-types'
import isEmail from 'validator/lib/isEmail'
import { createCodecValidationReportor } from '~/shared/libs/io-ts'
import { withIoTs } from '~/shared/libs/io-ts/remix-validated-form-helper'

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

export const reportEmailAndPasswordValidation =
  createCodecValidationReportor(emailAndPasswordC)
export const validatorEmailAndPassword = withIoTs(emailAndPasswordC)

export const extractEmailAndPasswordFromFormData = (formData: FormData) => {
  const emailAndPassword = {
    email: formData.get('email'),
    password: formData.get('password'),
  }
  return reportEmailAndPasswordValidation(emailAndPassword)
}
