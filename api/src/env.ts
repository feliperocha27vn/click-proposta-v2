import z from 'zod'

const envSchema = z.object({
  PORT: z.coerce.number().default(3333),
  JWT_SECRET: z.string(),
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  ABACATE_WEBHOOK_KEY: z.string(),
  ABACATE_RETURN_URL: z.url(),
  ABACATE_COMPLETATION_URL: z.url(),
  ABACATE_API_KEY: z.string(),
  GEMINI_API_KEY: z.string(),
})

export const env = envSchema.parse(process.env)
