import { createCookie } from '@remix-run/node'
import {
  createGeneratorHeaderWithCookie,
  getCookieRaw,
} from '~/shared/libs/cookie-helper.server'
import type { ColorScheme } from '.'
import { validateColorScheme } from '.'

export const colorSchemeCookie = createCookie('colorScheme', {
  maxAge: 604_800, // one week
})

export const parseColorSchemeCookie = async (
  request: Request
): Promise<ColorScheme> => {
  const parsedCookie = await colorSchemeCookie.parse(getCookieRaw(request))

  if (validateColorScheme(parsedCookie)) {
    return parsedCookie
  } else {
    return 'light'
  }
}

export const generateHeadersWithColorSchemeCookie =
  createGeneratorHeaderWithCookie<ColorScheme>(colorSchemeCookie)
