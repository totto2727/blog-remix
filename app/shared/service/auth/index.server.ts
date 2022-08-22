import type { LoaderArgs, TypedResponse } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import type { User } from '@supabase/supabase-js'
import { flow, pipe } from 'fp-ts/lib/function'
import { E, T, TE } from '~/shared/libs/fp-ts'
import {
  signInWithEmailAndPassword,
  signUpWithEmailAndPassword,
  verifyAndRefreshUser,
} from '~/shared/libs/supabase'
import { sessionToAuthCookie } from '~/shared/models/auth-cookie'
import {
  generateHeadersWithAuthCookie,
  parseAuthCookie,
} from '~/shared/models/auth-cookie/index.server'
import type { EmailAndPassword } from '~/shared/models/email-and-password'

export const requireAuth = (request: Request) =>
  pipe(
    request,
    parseAuthCookie,
    TE.chainW(verifyAndRefreshUser),
    TE.fold(
      (_) => T.of(redirect('/signin')),
      ({ user, auth }) =>
        pipe(
          auth,
          (auth) => () => generateHeadersWithAuthCookie(auth),
          T.map(({ headers }) => json(user, { headers }))
        )
    )
  )

// TODO 現状Cookieの設定ができない
// CookieSessionで管理？
// Cookieとオブジェクトのペアを渡す？
export const requireAuth_ = <T>(
  loaderArgs: LoaderArgs,
  loader: (loaderArgs: LoaderArgs, user: User) => Promise<TypedResponse<T>>
) =>
  pipe(
    loaderArgs.request,
    parseAuthCookie,
    TE.chainW(verifyAndRefreshUser),
    TE.chainTaskK(({ auth, user }) =>
      pipe(
        () => loader(loaderArgs, user),
        T.map((response) => ({ response, auth }))
      )
    ),
    TE.fold(
      (_) => T.of(redirect('signin')),
      ({ response, auth }) =>
        pipe(
          () => generateHeadersWithAuthCookie(auth),
          T.map(({ headers }) => {
            response.headers.set('Set-Cookie', headers['Set-Cookie'])
            return response
          })
        )
    )
  )

export const signin = (emailAndPassword: EmailAndPassword) =>
  pipe(
    emailAndPassword,
    flow(
      signInWithEmailAndPassword,
      // TODO API Errorの処理の設定
      TE.mapLeft(() => json('apiError'))
    ),
    TE.chainW(TE.fromEitherK(flow(sessionToAuthCookie, E.mapLeft(json)))),
    TE.fold(
      (e) => T.of(e),
      flow(
        (auth) => () => generateHeadersWithAuthCookie(auth),
        T.map((headers) => redirect('/admin', headers))
      )
    )
  )

export const signup = (emailAndPassword: EmailAndPassword) =>
  pipe(
    emailAndPassword,
    // TODO
    flow(
      signUpWithEmailAndPassword,
      TE.mapLeft(() => json('apiError'))
    ),
    TE.fold(T.of, () => T.of(redirect('/signin')))
  )
