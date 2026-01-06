import type { FastifyInstance } from 'fastify'
import { createNewBudget } from './create-new-budget'
import { fetchManyBudgets } from './fetch-many-budgets'
import { getByIdBudget } from './get-by-id-budget'

export function routesBudgets(app: FastifyInstance) {
  app.register(createNewBudget)
  app.register(getByIdBudget)
  app.register(fetchManyBudgets)
}
