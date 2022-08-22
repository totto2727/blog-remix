import type { ButtonProps } from '@mantine/core'
import { Button } from '@mantine/core'
import type { PolymorphicComponentProps } from '@mantine/utils'
import type { FC } from 'react'
import { useFormContext, useIsSubmitting } from 'remix-validated-form'

export const SubmitButton: FC<
  Omit<PolymorphicComponentProps<'button', ButtonProps>, 'type'>
> = (props) => {
  const isSubmitting = useIsSubmitting()
  const { isValid } = useFormContext()
  const disabled = isSubmitting || !isValid
  return (
    <Button
      {...props}
      type='submit'
      disabled={(props.disabled ?? false) || disabled}
    >
      {isSubmitting ? 'Submitting...' : 'Submit'}
    </Button>
  )
}
