import { PrismaCustomerRepository } from '@/repositories/prisma/customer-repository'
import { PrismaBudgetsRepository } from '@/repositories/prisma/prisma-budgets-repository'
import { PrismaBudgetsServicesRepository } from '@/repositories/prisma/prisma-budgets-services-repository'
import { PrismaUsersRepository } from '@/repositories/prisma/users-repository'
import { GetInfoForRegenaretePdfUseCase } from '@/use-cases/budgets/get-info-for-regenarete-pdf'

export function makeGetInfoForRegenaretePdfUseCase() {
  const prismabudgetsRepository = new PrismaBudgetsRepository()
  const prismausersRepository = new PrismaUsersRepository()
  const prismaBudgetsServicesRepository = new PrismaBudgetsServicesRepository()
  const prismaCustomersRepository = new PrismaCustomerRepository()
  const getInfoForRegenaretePdfUseCase = new GetInfoForRegenaretePdfUseCase(
    prismabudgetsRepository,
    prismausersRepository,
    prismaBudgetsServicesRepository,
    prismaCustomersRepository
  )

  return getInfoForRegenaretePdfUseCase
}
