import z from 'zod'

const envSchema = z.object({
  PORT: z.coerce.number().default(3334),
  REDIS_URL: z.string().url().optional(),
  API_URL: z.string().url(),
  BOT_SERVICE_TOKEN: z.string(),
  GEMINI_API_KEY: z.string(),
  EVOLUTION_API_URL: z.string().url(),
  EVOLUTION_API_TOKEN: z.string(),
})

export const env = envSchema.parse(process.env)
