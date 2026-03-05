// As variáveis VITE_ são substituídas inline pelo Vite em build-time.
// Usando import.meta.env direto para que os NOMES das variáveis
// não apareçam como strings literais no bundle de produção.
export const env = {
  VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL as string,
  VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY as string,
  VITE_API_URL: import.meta.env.VITE_API_URL as string,
  VITE_APP_URL: import.meta.env.VITE_APP_URL as string,
} as const
