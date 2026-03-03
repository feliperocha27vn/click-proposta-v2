import { fastify } from 'fastify'
import { webhookRoutes } from './http/controllers/webhook/webhook'

export const app = fastify()

app.register(webhookRoutes)
