import type { TypeOf } from 'io-ts'
import { union, literal } from 'io-ts'
import { createCodecValidationReportor } from '~/shared/libs/io-ts'

export const colorSchemeC = union([literal('light'), literal('dark')])
export type ColorScheme = TypeOf<typeof colorSchemeC>
export const reportColorSchemeValidation =
  createCodecValidationReportor(colorSchemeC)

export const notifyColorSchemeChange = async () =>
  await fetch('/cookie/color-scheme', { method: 'get' })

export const toggleColorScheme = (
  colorScheme: ColorScheme | null | undefined
) => {
  switch (colorScheme) {
    case 'light':
      return 'dark'
    case 'dark':
      return 'light'
    default:
      return 'light'
  }
}
