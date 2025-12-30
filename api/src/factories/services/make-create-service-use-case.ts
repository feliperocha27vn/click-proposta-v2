import { PrismaServicesRepository } from '@/repositories/prisma/services-repository'
import { CreateServiceUseCase } from '@/use-cases/services/create'

export function makeCreateServiceUseCase() {
  const prismaServiceRepository = new PrismaServicesRepository()
  const createServiceUseCase = new CreateServiceUseCase(prismaServiceRepository)

  return createServiceUseCase
}
