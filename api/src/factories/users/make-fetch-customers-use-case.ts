import { PrismaUsersRepository } from '@/repositories/prisma/users-repository'
import { FetchCustomersUseCase } from '@/use-cases/users/fetch-customers'

export function makeFetchCustomersUseCase() {
  const prismaUsersRepository = new PrismaUsersRepository()
  const fetchCustomersUseCase = new FetchCustomersUseCase(prismaUsersRepository)

  return fetchCustomersUseCase
}
