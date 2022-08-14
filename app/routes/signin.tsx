import { Button, TextInput } from '@mantine/core'
import type { LoaderArgs } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useActionData } from '@remix-run/react'
import { isLeft } from 'fp-ts/lib/Either'
import {
  useField,
  useFormContext,
  useIsSubmitting,
  ValidatedForm,
} from 'remix-validated-form'
import { withIoTs } from '~/shared/libs/io-ts/remix-validated-form-helper'
import { supabaseAuthAPISignInWithEmail } from '~/shared/libs/supabase-helper'
import { generateHeadersWithAuthCookie } from '~/shared/models/auth-cookie/index.server'
import {
  emailAndPasswordC,
  extractEmailAndPasswordFromFormData,
} from '~/shared/models/email-and-password'

const validator = withIoTs(emailAndPasswordC)

export const action = async ({ request }: LoaderArgs) => {
  const form = await request.formData()
  const emailAndPasswordEither = extractEmailAndPasswordFromFormData(form)
  if (isLeft(emailAndPasswordEither)) return json(emailAndPasswordEither.left)

  const emailAndPassword = emailAndPasswordEither.right
  const authEither = await supabaseAuthAPISignInWithEmail(emailAndPassword)()
  if (isLeft(authEither)) return json(authEither.left)

  const { access_token, refresh_token } = authEither.right
  if (!refresh_token) {
    return json({})
  }

  return redirect(
    '/admin',
    await generateHeadersWithAuthCookie({
      access: access_token,
      refresh: refresh_token,
    })
  )
}

export const Input = ({ name, label }: { name: string; label: string }) => {
  const { error, getInputProps } = useField(name)
  return <TextInput {...getInputProps()} label={label} error={error} />
}

export const SubmitButton = () => {
  const isSubmitting = useIsSubmitting()
  const { isValid } = useFormContext()
  const disabled = isSubmitting || !isValid
  return (
    <Button type='submit' disabled={disabled}>
      {isSubmitting ? 'Submitting...' : 'Submit'}
    </Button>
  )
}

export default function SignIn() {
  const error = useActionData<typeof action>()
  return (
    <ValidatedForm validator={validator} method='post'>
      <Input name='email' label='Email' />
      <Input name='password' label='Password' />
      <SubmitButton />
      {error && <div>{JSON.stringify(error)}</div>}
    </ValidatedForm>
  )
}
// export default function SignIn() {
//   useActionData<typeof action>()
//   return (
//     <Form method='post'>
//       <div>
//         <label htmlFor='email'>Email</label>
//         <input type='email' name='email' id='email' />
//       </div>

//       <div>
//         <label htmlFor='password'>Password</label>
//         <input type='password' name='password' id='password' />
//       </div>

//       <button>Log In</button>
//     </Form>
//   )
// }
