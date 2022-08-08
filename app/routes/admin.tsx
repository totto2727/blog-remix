import type { LoaderArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { Outlet, useLoaderData } from '@remix-run/react'
import { isLeft } from 'fp-ts/lib/Either'
import { supabase } from '~/shared/configs/supabase'
import {
  parseAuthCookie,
  generateHeadersWithAuthCookie,
} from '~/shared/models/auth-cookie/index.server'

export const loader = async ({ request }: LoaderArgs) => {
  const cookieEither = await parseAuthCookie(request)
  if (isLeft(cookieEither)) return redirect('/signin')

  const { access, refresh } = cookieEither.right
  const { data: user } = await supabase.auth.api.getUser(access)
  if (!user) return redirect('/signin')

  const { data: session } = await supabase.auth.api.refreshAccessToken(refresh)
  if (!session?.access_token || !session.refresh_token)
    return redirect('/signin')

  return json(
    user,
    await generateHeadersWithAuthCookie({
      access: session.access_token,
      refresh: session.refresh_token,
    })
  )
}

export default function Admin() {
  const data = useLoaderData<typeof loader>()
  return <Outlet />
}
