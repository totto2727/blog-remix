import * as t from 'io-ts'
import type { NonEmptyString } from 'io-ts-types'
import { withMessage } from 'io-ts-types'
import isEmail from 'validator/lib/isEmail'
import { Validator } from '~/shared/libs/io-ts-helper'

type IEmail = { readonly Email: unique symbol }
const emailC = t.brand(
  t.string,
  (n): n is t.Branded<NonEmptyString, IEmail> => isEmail(n),
  'Email'
)
type Email = t.TypeOf<typeof emailC>

const emailAndPasswordC = t.type({
  email: withMessage(emailC, () => 'Email is string'),
  password: withMessage(t.string, () => 'Password is string'),
})

const emailAndPasswordValidator = new Validator(emailAndPasswordC)

export const extractEmailAndPasswordFromFormData = (formData: FormData) => {
  const emailAndPassword = {
    email: formData.get('email'),
    password: formData.get('password'),
  }
  if (emailAndPasswordValidator.validate(emailAndPassword)) {
    return { emailAndPassword }
  } else {
    return { error: emailAndPasswordValidator.error }
  }
}
