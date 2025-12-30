import { PrismaUsersRepository } from '@/repositories/prisma/users-repository'
import { CreateNewCostumerUseCase } from '@/use-cases/users/create-new-customer'

export function makeCreateNewCustomerUseCase() {
  const prismaUsersRepository = new PrismaUsersRepository()
  const createNewCustomerUseCase = new CreateNewCostumerUseCase(
    prismaUsersRepository
  )

  return createNewCustomerUseCase
}
