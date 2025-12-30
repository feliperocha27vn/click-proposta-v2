import type { FastifyInstance } from 'fastify'
import { completeRegister } from './complete-register'
import { createNewCostumer } from './create-new-costumer'
import { fetchCustomers } from './fetch-customers'
import { getCompleteRegister } from './get-complet-resgister'
import { getDataForPayment } from './get-data-for-payment'
import { getMe } from './me'
import { searchByNameEmail } from './search-by-name-email'

export function usersRoutes(app: FastifyInstance) {
  app.register(createNewCostumer)
  app.register(fetchCustomers)
  app.register(searchByNameEmail)
  app.register(completeRegister)
  app.register(getCompleteRegister)
  app.register(getDataForPayment)
  app.register(getMe)
}
