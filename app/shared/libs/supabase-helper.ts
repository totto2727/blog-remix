import type { PostgrestFilterBuilder } from '@supabase/postgrest-js'

export const supabaseFetch =
  <T>(query: PostgrestFilterBuilder<T>) =>
  async () => {
    const { data, error } = await query.then()
    if (error) {
      throw error
    }
    return data
  }
