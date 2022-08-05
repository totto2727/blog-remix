import type { ActionFunction } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Form, useActionData } from '@remix-run/react'
import { supabase } from '~/shared/configs/supabase'
import { extractEmailAndPasswordFromFormData } from '~/shared/models/email-and-password'
export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData()
  const { emailAndPassword, error: formError } =
    extractEmailAndPasswordFromFormData(form)
  if (!emailAndPassword) return json({ error: formError })

  const { error } = await supabase.auth.signUp(emailAndPassword)

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
