import { createCookie } from '@remix-run/node'
import {
  createGeneratorHeaderWithCookie,
  getCookieRaw,
} from '~/shared/libs/cookie-helper.server'
import * as t from 'io-ts'
import { createTypeChecker } from '~/shared/libs/io-ts-helper'
import { COOKIE_SECRET } from '~/shared/configs/cookie.server'

const authCookie = createCookie('auth', {
  maxAge: 180, //3分間待
  httpOnly: true,
  secrets: COOKIE_SECRET,
  secure: process.env.NODE_ENV === 'production',
})

const authC = t.type({ access: t.string, refresh: t.string })
type Auth = t.TypeOf<typeof authC>
const validateAuthCookie = createTypeChecker(authC)

export const parseAuthCookie = async (request: Request) => {
  const rawCookie = getCookieRaw(request)
  const parsedCookie = await authCookie.parse(rawCookie)
  if (validateAuthCookie(parsedCookie)) return parsedCookie
  else return undefined
}

export const generateHeadersWithAuthCookie =
  createGeneratorHeaderWithCookie<Auth>(authCookie)
