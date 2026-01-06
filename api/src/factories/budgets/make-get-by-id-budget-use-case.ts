import { PrismaBudgetsRepository } from '@/repositories/prisma/prisma-budgets-repository'
import { PrismaBudgetsServicesRepository } from '@/repositories/prisma/prisma-budgets-services-repository'
import { PrismaUsersRepository } from '@/repositories/prisma/users-repository'

import { GetByIdBudgetUseCase } from '@/use-cases/budgets/get-by-id-budget-use-case'

export function makeGetByIdBudgetUseCase() {
  const budgetsRepository = new PrismaBudgetsRepository()
  const usersRepository = new PrismaUsersRepository()
  const budgetsServicesRepository = new PrismaBudgetsServicesRepository()

  const useCase = new GetByIdBudgetUseCase(
    budgetsRepository,
    usersRepository,
    budgetsServicesRepository
  )

  return useCase
}
