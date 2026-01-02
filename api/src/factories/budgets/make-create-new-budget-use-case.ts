import { PrismaCustomerRepository } from '@/repositories/prisma/customer-repository'
import { PrismaBudgetsRepository } from '@/repositories/prisma/prisma-budgets-repository'
import { PrismaBudgetsServicesRepository } from '@/repositories/prisma/prisma-budgets-services-repository'
import { PrismaUsersRepository } from '@/repositories/prisma/users-repository'
import { CreateNewBudgetUseCase } from '@/use-cases/budgets/create-new-budget'

export function makeCreateNewBudgetUseCase() {
  const prismaBudgetsRepository = new PrismaBudgetsRepository()
  const prismaUsersRepository = new PrismaUsersRepository()
  const prismaBudgetsServicesRepository = new PrismaBudgetsServicesRepository()
  const prismaCustomerRepository = new PrismaCustomerRepository()
  const createNewBudgetUseCase = new CreateNewBudgetUseCase(
    prismaBudgetsRepository,
    prismaUsersRepository,
    prismaBudgetsServicesRepository,
    prismaCustomerRepository
  )

  return createNewBudgetUseCase
}
