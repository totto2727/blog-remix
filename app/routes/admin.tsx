import type { LoaderArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Outlet, useLoaderData } from '@remix-run/react'
import { requireAuth_ } from '~/shared/service/auth/index.server'

export const loader = (loaderArgs: LoaderArgs) =>
  /* requireAuth(loaderArgs.request)() */
  requireAuth_(loaderArgs, async (_, user) => json(user))()

export default function Admin() {
  const user = useLoaderData<typeof loader>()
  console.log(user)
  return <Outlet />
}
