import { PrismaUsersRepository } from '@/repositories/prisma/users-repository'
import { GetUserByIdUseCase } from '@/use-cases/users/get-by-id'

export function makeGetUserByIdUseCase() {
  const prismaUsersRepository = new PrismaUsersRepository()
  const getUserByIdUseCase = new GetUserByIdUseCase(prismaUsersRepository)
  return getUserByIdUseCase
}
