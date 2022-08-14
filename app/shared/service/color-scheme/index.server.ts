import { json } from '@remix-run/node'
import type { ColorScheme } from '~/shared/models/color-scheme'
import { toggleColorScheme } from '~/shared/models/color-scheme'
import {
  generateHeadersWithColorSchemeCookie,
  parseColorSchemeCookie,
} from '~/shared/models/color-scheme/index.server'

export const toggleColorSchemeCookie = async (request: Request) => {
  const parsedCookie = await parseColorSchemeCookie(request)
  const nextColorScheme = toggleColorScheme(parsedCookie)
  return json<ColorScheme>(
    nextColorScheme,
    await generateHeadersWithColorSchemeCookie(nextColorScheme)
  )
}

export const addColorSchemeCookie = async ( request :Request) => {
  const parsedCookie = await parseColorSchemeCookie(request)
  return json<ColorScheme>(
    parsedCookie,
    await generateHeadersWithColorSchemeCookie(parsedCookie)
  )
}

