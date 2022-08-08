import type { PostgrestFilterBuilder } from '@supabase/postgrest-js'
import { tryCatch } from 'fp-ts/lib/TaskEither'
import { supabase } from '../configs/supabase'
import type { EmailAndPassword } from '../models/email-and-password'

export const supabaseFetch =
  <T>(query: PostgrestFilterBuilder<T>) =>
  async () => {
    const { data, error } = await query.then()
    if (error) {
      throw error
    }
    return data
  }

export const supabaseAuthAPISignInWithEmail = ({
  email,
  password,
}: EmailAndPassword) =>
  tryCatch(
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
    (error) => error
  )
