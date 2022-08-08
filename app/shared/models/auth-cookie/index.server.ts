import { createCookie } from '@remix-run/node'
import {
  createGeneratorHeaderWithCookie,
  getCookieRaw,
} from '~/shared/libs/cookie-helper.server'
import { COOKIE_SECRET } from '~/shared/configs/cookie.server'
import type { Auth } from '.'
import { authValidator } from '.'
import { validateAuthCookie } from '.'
import { left, right } from 'fp-ts/lib/Either'

const authCookie = createCookie('auth', {
  maxAge: 180, //3分間待
  httpOnly: true,
  secrets: COOKIE_SECRET,
  secure: process.env.NODE_ENV === 'production',
})

export const parseAuthCookie = async (request: Request) => {
  const rawCookie = getCookieRaw(request)
  const parsedCookie = await authCookie.parse(rawCookie)
  if (authValidator.validate(parsedCookie)) return right(parsedCookie)
  else return left(authValidator.error)
}

export const generateHeadersWithAuthCookie =
  createGeneratorHeaderWithCookie<Auth>(authCookie)
