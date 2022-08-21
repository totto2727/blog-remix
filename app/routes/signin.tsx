import { Button, TextInput } from '@mantine/core'
import type { LoaderArgs } from '@remix-run/node'
import { useActionData } from '@remix-run/react'
import type { HTMLInputTypeAttribute } from 'react'
import {
  useField,
  useFormContext,
  useIsSubmitting,
  ValidatedForm,
  validationError,
} from 'remix-validated-form'
import { validatorEmailAndPassword } from '~/shared/models/email-and-password'
import { signin } from '~/shared/service/auth/index.server'

export const action = async ({ request }: LoaderArgs) => {
  const emailAndPassword = await validatorEmailAndPassword.validate(
    await request.formData()
  )
  if (emailAndPassword.error) return validationError(emailAndPassword.error)
  return await signin(emailAndPassword.data)()
}

export const Input = (props: {
  type: HTMLInputTypeAttribute
  name: string
  label?: string
}) => {
  const { error, getInputProps } = useField(props.name)
  return <TextInput {...props} {...getInputProps()} error={error} />
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
    <ValidatedForm validator={validatorEmailAndPassword} method='post'>
      <Input type='email' name='email' label='Email' />
      <Input type='password' name='password' label='Password' />
      <SubmitButton />
      {error && <div>{JSON.stringify(error)}</div>}
    </ValidatedForm>
  )
}
