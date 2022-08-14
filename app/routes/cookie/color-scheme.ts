import type { LoaderFunction } from '@remix-run/node'
import { toggleColorSchemeCookie } from '~/shared/service/color-scheme/index.server'

export const loader: LoaderFunction = async ({ request }) =>
  await toggleColorSchemeCookie(request)
