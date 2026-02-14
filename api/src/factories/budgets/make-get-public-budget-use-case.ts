import { PrismaCustomerRepository } from '@/repositories/prisma/customer-repository'
import { PrismaBudgetsRepository } from '@/repositories/prisma/prisma-budgets-repository'
import { PrismaBudgetsServicesRepository } from '@/repositories/prisma/prisma-budgets-services-repository'
import { PrismaUsersRepository } from '@/repositories/prisma/users-repository'
import { GetPublicBudgetUseCase } from '@/use-cases/budgets/get-public-budget-use-case'

export function makeGetPublicBudgetUseCase() {
  const budgetsRepository = new PrismaBudgetsRepository()
  const usersRepository = new PrismaUsersRepository()
  const budgetsServicesRepository = new PrismaBudgetsServicesRepository()
  const customersRepository = new PrismaCustomerRepository()

  const useCase = new GetPublicBudgetUseCase(
    budgetsRepository,
    usersRepository,
    budgetsServicesRepository,
    customersRepository
  )

  return useCase
}
