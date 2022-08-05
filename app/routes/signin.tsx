import type { LoaderArgs } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Form, useActionData } from '@remix-run/react'
import { supabase } from '~/shared/configs/supabase'
import { generateHeadersWithAuthCookie } from '~/shared/models/auth-cookie/index.server'
import { extractEmailAndPasswordFromFormData } from '~/shared/models/email-and-password'

export const action = async ({ request }: LoaderArgs) => {
  const form = await request.formData()
  const { emailAndPassword, error: formError } =
    extractEmailAndPasswordFromFormData(form)
  if (!emailAndPassword) return json({ error: formError })

  const { data: session, error } = await supabase.auth.api.signInWithEmail(
    emailAndPassword.email,
    emailAndPassword.password
  )
  if (!session?.access_token || !session.refresh_token) return json({ error })

  return redirect(
    '/admin',
    await generateHeadersWithAuthCookie({
      access: session.access_token,
      refresh: session.refresh_token,
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
