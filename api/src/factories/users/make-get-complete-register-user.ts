import { PrismaUsersRepository } from '@/repositories/prisma/users-repository'
import { GetCompleteRegisterUserUseCase } from '@/use-cases/users/get-complete-register'

export function makeGetCompleteRegisterUser() {
  const prismaUserRepository = new PrismaUsersRepository()
  const getCompleteUseCase = new GetCompleteRegisterUserUseCase(
    prismaUserRepository
  )

  return getCompleteUseCase
}
