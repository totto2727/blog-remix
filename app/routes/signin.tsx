import type { LoaderArgs } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Form, useActionData } from '@remix-run/react'
import { isLeft } from 'fp-ts/lib/Either'
import { supabaseAuthAPISignInWithEmail } from '~/shared/libs/supabase-helper'
import { generateHeadersWithAuthCookie } from '~/shared/models/auth-cookie/index.server'
import { extractEmailAndPasswordFromFormData } from '~/shared/models/email-and-password'

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

export default function SignIn() {
  useActionData<typeof action>()
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
