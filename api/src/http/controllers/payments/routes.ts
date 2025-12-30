import type { FastifyInstance } from 'fastify'
import { confirmPayment } from './confirm-payment'
import { createNewPayment } from './create-new-payment'

export function routesPayments(app: FastifyInstance) {
  app.register(createNewPayment)
  app.register(confirmPayment)
}
