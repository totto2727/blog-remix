import { Container, Stack } from '@mantine/core'
import type { ActionFunction } from '@remix-run/node'
import { useActionData } from '@remix-run/react'
import { ValidatedForm, validationError } from 'remix-validated-form'
import { BlogHeader } from '~/features/blog/components/domain/blog-header'
import { SubmitButton, TextInput } from '~/shared/components/domain/form'
import { AppShell, HeaderProvider } from '~/shared/components/ui/app-shell'
import { validatorEmailAndPassword } from '~/shared/models/email-and-password'
import { signup } from '~/shared/service/auth/index.server'

export const action: ActionFunction = async ({ request }) => {
  const emailAndPassword = await validatorEmailAndPassword.validate(
    await request.formData()
  )
  if (emailAndPassword.error) return validationError(emailAndPassword.error)
  return await signup(emailAndPassword.data)()
}

export default function SignUp() {
  const error = useActionData<typeof action>()
  return (
    <HeaderProvider value={BlogHeader}>
      <AppShell>
        <Container>
          <ValidatedForm validator={validatorEmailAndPassword} method='post'>
            <Stack>
              <TextInput type='email' name='email' label='Email' />
              <TextInput type='password' name='password' label='Password' />
              <SubmitButton size='md' />
              {error && <div>{JSON.stringify(error)}</div>}
            </Stack>
          </ValidatedForm>
        </Container>
      </AppShell>
    </HeaderProvider>
  )
}
