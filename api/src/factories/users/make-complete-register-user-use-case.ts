import { PrismaUsersRepository } from '@/repositories/prisma/users-repository'
import { CompleteRegisterUserUseCase } from '@/use-cases/users/complete-register'

export function makeCompleteRegisterUserUseCase() {
  const prismaUsersRepository = new PrismaUsersRepository()
  const completeRegisterUserUseCase = new CompleteRegisterUserUseCase(
    prismaUsersRepository
  )

  return completeRegisterUserUseCase
}
