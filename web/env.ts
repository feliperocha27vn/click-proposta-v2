import z from 'zod'

const envSchema = z.object({
  VITE_SUPABASE_URL: z.url(),
  VITE_SUPABASE_ANON_KEY: z.string().min(32).max(256),
  VITE_API_URL: z.url(),
  VITE_APP_URL: z.url(),
})

// Usar import.meta.env no ambiente do browser/Vite, process.env no Node.js
const envSource =
  typeof import.meta !== 'undefined' ? import.meta.env : process.env

export const env = envSchema.parse(envSource)
