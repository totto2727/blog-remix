import type { PostgrestFilterBuilder } from '@supabase/postgrest-js'
import type { ApiError } from '@supabase/supabase-js'
import { pipe } from 'fp-ts/lib/function'
import { supabase } from '~/shared/configs/supabase'
import type { AuthCookie } from '~/shared/models/auth-cookie'
import type { EmailAndPassword } from '~/shared/models/email-and-password'
import { TE } from '../fp-ts'
import { t } from '../io-ts'

export const apiErrorC = t.union([
  t.type({
    message: t.string,
    status: t.number,
  }),
  t.null,
])

export const query =
  <T>(query: PostgrestFilterBuilder<T>) =>
  async () => {
    const { data, error } = await query.then()
    if (error) {
      throw error
    }
    return data
  }

export const signInWithEmailAndPassword = ({
  email,
  password,
}: EmailAndPassword) =>
  TE.tryCatch(
    async () => {
      const { data, error } = await supabase.auth.api.signInWithEmail(
        email,
        password
      )
      if (error || !data || !data.access_token || !data.refresh_token) {
        throw error
      }
      return data
    },
    (e) => {
      if (e) return e as ApiError
      else return null
    }
  )

export const signUpWithEmailAndPassword = ({
  email,
  password,
}: EmailAndPassword) =>
  TE.tryCatch(
    async () => {
      const { data, error } = await supabase.auth.api.signUpWithEmail(
        email,
        password
      )
      if (error || !data) throw error
      else return data
    },
    (e) => {
      if (e) return e as ApiError
      else return null
    }
  )
export const verifyAccessToken = (access: string) =>
  TE.tryCatch(
    async () => {
      const { user, error } = await supabase.auth.api.getUser(access)
      if (user) return user
      else throw error
    },
    (e) => {
      if (e) return e as ApiError
      else return null
    }
  )

export const refreshAccessToken = (refresh: string) =>
  TE.tryCatch(
    async () => {
      const { data, error } = await supabase.auth.api.refreshAccessToken(
        refresh
      )
      if (data?.access_token && data?.refresh_token)
        return {
          access: data.access_token,
          refresh: data.refresh_token,
        }
      throw error
    },
    (e) => {
      if (e) return e as ApiError
      else return null
    }
  )

export const verifyAndRefreshUser = (auth: AuthCookie) =>
  pipe(
    refreshAccessToken(auth.refresh),
    TE.chain((auth) =>
      pipe(
        verifyAccessToken(auth.access),
        TE.map((user) => ({
          user,
          auth,
        }))
      )
    )
  )
