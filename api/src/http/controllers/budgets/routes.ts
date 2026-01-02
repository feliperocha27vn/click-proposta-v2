import type { FastifyInstance } from 'fastify'
import { createNewBudget } from './create-new-budget'

export function routesBudgets(app: FastifyInstance) {
  app.register(createNewBudget)
}
