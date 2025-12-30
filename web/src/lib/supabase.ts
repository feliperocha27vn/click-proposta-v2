import { createClient } from '@supabase/supabase-js'
import { env } from '../../env'

const supabaseUrl =
  env.VITE_SUPABASE_URL || (process.env.SUPABASE_URL as string)
const supabaseAnonKey =
  (env.VITE_SUPABASE_ANON_KEY as string) ||
  (process.env.SUPABASE_ANON_KEY as string)

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
