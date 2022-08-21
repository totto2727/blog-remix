import { createCookie } from '@remix-run/node'
import { isRight } from 'fp-ts/lib/Either'
import {
  createGeneratorHeaderWithCookie,
  getCookieRaw,
} from '~/shared/libs/cookie'
import type { ColorScheme } from '.'
import { reportColorSchemeValidation } from '.'

const colorSchemeCookie = createCookie('colorScheme', {
  maxAge: 7 * 24 * 60 * 60,
})

export const parseColorSchemeCookie = async (
  request: Request
): Promise<ColorScheme> => {
  const parsedCookie = await colorSchemeCookie.parse(getCookieRaw(request))

  const report = reportColorSchemeValidation(parsedCookie)
  if (isRight(report)) {
    return report.right
  } else {
    return 'light'
  }
}

export const generateHeadersWithColorSchemeCookie =
  createGeneratorHeaderWithCookie<ColorScheme>(colorSchemeCookie)
