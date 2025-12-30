import { PrismaCustomerRepository } from '@/repositories/prisma/customer-repository'
import { GetCostumerByIdUseCase } from '@/use-cases/customer/get-by-id'

export function makeGetCostumerByIdUseCase() {
  const customerRepository = new PrismaCustomerRepository()
  const getCostumerByIdUseCase = new GetCostumerByIdUseCase(customerRepository)

  return getCostumerByIdUseCase
}
