import type { ActionFunction } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Form, useActionData } from '@remix-run/react'
import { supabase } from '~/shared/configs/supabase'
import { E } from '~/shared/libs/fp-ts'
import { extractEmailAndPasswordFromFormData } from '~/shared/models/email-and-password'

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData()
  const emailAndPasswordEither = extractEmailAndPasswordFromFormData(form)
  if (E.isLeft(emailAndPasswordEither))
    return json({ error: emailAndPasswordEither.left })

  const { error } = await supabase.auth.signUp(emailAndPasswordEither.right)

  if (error) return json({ error })
  else return redirect('/signin')
}

export default function SignUp() {
  useActionData()
  return (
    <Form method='post'>
      <div>
        <label htmlFor='email'>Email</label>
        <input type='email' name='email' id='email' />
      </div>

      <div>
        <label htmlFor='password'>Password</label>
        <input type='password' name='password' id='password' />
      </div>

      <button>Log In</button>
    </Form>
  )
}
