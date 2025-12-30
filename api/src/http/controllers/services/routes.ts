import type { FastifyInstance } from 'fastify'
import { create } from './create'
import { deleteService } from './delete'
import { fetchMany } from './fetch-many'
import { update } from './update'

export function routesService(app: FastifyInstance) {
  app.register(create)
  app.register(fetchMany)
  app.register(deleteService)
  app.register(update)
}
