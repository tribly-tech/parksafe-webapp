import { createClient } from '@supabase/supabase-js'
import { env } from '../types/env'

/**
 * Supabase server client — uses service role key for full DB access.
 * Only use this in server-side service functions — NEVER expose to the client.
 * RLS is still enforced at the DB level as a defence-in-depth measure.
 */
export const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
})
