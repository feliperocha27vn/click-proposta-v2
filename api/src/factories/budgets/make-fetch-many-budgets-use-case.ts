import { PrismaCustomerRepository } from '@/repositories/prisma/customer-repository'
import { PrismaBudgetsRepository } from '@/repositories/prisma/prisma-budgets-repository'
import { PrismaUsersRepository } from '@/repositories/prisma/users-repository'
import { FetchManyBudgetsUseCase } from '@/use-cases/budgets/fetch-many-budgets-use-case'

export function makeFetchManyBudgetsUseCase() {
  const prismaUsersRepository = new PrismaUsersRepository()
  const prismaBudgetsRepository = new PrismaBudgetsRepository()
  const prismaCustomersRepository = new PrismaCustomerRepository()
  const fetchManyBudgetsUseCase = new FetchManyBudgetsUseCase(
    prismaUsersRepository,
    prismaBudgetsRepository,
    prismaCustomersRepository
  )

  return fetchManyBudgetsUseCase
}
