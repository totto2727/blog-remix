import type { TypeOf } from 'io-ts'
import { union, literal } from 'io-ts'
import { createTypeChecker } from '~/shared/libs/io-ts-helper'

export const colorSchemeC = union([literal('light'), literal('dark')])
export const validateColorScheme = createTypeChecker(colorSchemeC)
export type ColorScheme = TypeOf<typeof colorSchemeC>

export const notifyColorSchemeChange = async () =>
  await fetch('/cookie/colorScheme', { method: 'get' })

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
