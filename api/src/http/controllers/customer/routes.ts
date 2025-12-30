import type { FastifyInstance } from 'fastify'
import { getById } from './get-by-id'

export function routesCustomer(app: FastifyInstance) {
  app.register(getById)
}
