import { createCookie } from '@remix-run/node'
import { COOKIE_SECRET } from '~/shared/configs/cookie.server'
import {
  createGeneratorHeaderWithCookie,
  parseCookie,
} from '~/shared/libs/cookie'
import type { AuthCookie } from '.'
import { authCookieC } from '.'

const authCookie = createCookie('auth', {
  maxAge: 7 * 24 * 60 * 60,
  httpOnly: true,
  secrets: COOKIE_SECRET,
  secure: process.env.NODE_ENV === 'production',
})

export const parseAuthCookie = parseCookie(authCookie, authCookieC)
export const generateHeadersWithAuthCookie =
  createGeneratorHeaderWithCookie<AuthCookie>(authCookie)
