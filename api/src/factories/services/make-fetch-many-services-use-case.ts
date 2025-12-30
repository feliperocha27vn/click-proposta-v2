import { PrismaServicesRepository } from '@/repositories/prisma/services-repository'
import { FetchManyServicesUseCase } from '@/use-cases/services/fetch-many'

export function makeFetchManyServicesUseCase() {
  const prismaServicesRepository = new PrismaServicesRepository()
  const fetchManyServicesUseCase = new FetchManyServicesUseCase(
    prismaServicesRepository
  )

  return fetchManyServicesUseCase
}
