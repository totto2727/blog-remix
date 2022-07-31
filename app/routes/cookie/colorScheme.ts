import type { LoaderFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import type { ColorScheme } from '~/shared/models/colorSchemeCookie'
import { toggleColorScheme } from '~/shared/models/colorSchemeCookie'
import {
  generateHeadersWithColorSchemeCookie,
  parseColorSchemeCookie,
} from '~/shared/models/colorSchemeCookie/index.server'

export const loader: LoaderFunction = async ({ request }) => {
  const parsedCookie = await parseColorSchemeCookie(request)
  const nextColorScheme = toggleColorScheme(parsedCookie)
  return json<ColorScheme>(
    nextColorScheme,
    await generateHeadersWithColorSchemeCookie(nextColorScheme)
  )
}
