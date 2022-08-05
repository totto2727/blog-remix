import type { LoaderFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import type {
  ColorScheme} from '~/shared/models/color-scheme-cookie';
import {
  toggleColorScheme,
} from '~/shared/models/color-scheme-cookie'
import {
  parseColorSchemeCookie,
  generateHeadersWithColorSchemeCookie,
} from '~/shared/models/color-scheme-cookie/index.server'

export const loader: LoaderFunction = async ({ request }) => {
  const parsedCookie = await parseColorSchemeCookie(request)
  const nextColorScheme = toggleColorScheme(parsedCookie)
  return json<ColorScheme>(
    nextColorScheme,
    await generateHeadersWithColorSchemeCookie(nextColorScheme)
  )
}
