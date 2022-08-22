import { TextInput as TextInputMantine } from '@mantine/core'
import type { HTMLInputTypeAttribute } from 'react'
import { useField } from 'remix-validated-form'

export const TextInput = (props: {
  type: HTMLInputTypeAttribute
  name: string
  label?: string
}) => {
  const { error, getInputProps } = useField(props.name)
  return <TextInputMantine {...props} {...getInputProps()} error={error} />
}
