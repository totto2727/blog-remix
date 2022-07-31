import type { Cookie } from '@remix-run/node'

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
