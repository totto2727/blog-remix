import type { Cookie } from '@remix-run/node'
import { pipe } from 'fp-ts/lib/function'
import type { Type } from 'io-ts'
import { T, TE } from '../fp-ts'
import { reportErrors } from '../io-ts/report-errors'

export const getCookieRaw = (request: Request) => {
  const cookieHeader = request.headers.get('Cookie')
  if (cookieHeader) {
    return cookieHeader
  }
  return ''
}

export const createGeneratorHeaderWithCookie =
  <T>(cookie: Cookie) =>
  async (value: T) => ({
    headers: {
      'Set-Cookie': await cookie.serialize(value),
    },
  })

export const parseCookie =
  <T, O = T>(cookie: Cookie, codec: Type<T, O, unknown>) =>
  (request: Request) =>
    pipe(
      request.headers.get('Cookie'),
      (cookieRaw) => () => cookie.parse(cookieRaw),
      T.map(codec.decode),
      TE.mapLeft(reportErrors)
    )
