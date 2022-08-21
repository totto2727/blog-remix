import type { Session } from '@supabase/supabase-js'
import { createCodecValidationReportor, t } from '~/shared/libs/io-ts'

export const authCookieC = t.type({ access: t.string, refresh: t.string })
export type AuthCookie = t.TypeOf<typeof authCookieC>

export const reportValidationAuthCookie =
  createCodecValidationReportor(authCookieC)

export const sessionToAuthCookie = (session: Session) =>
  reportValidationAuthCookie({
    access: session.access_token,
    refresh: session.refresh_token,
  })
