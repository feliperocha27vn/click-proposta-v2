import { PrismaUsersRepository } from '@/repositories/prisma/users-repository'
import { ChangePlanUserUseCase } from '@/use-cases/users/change-plan'

export function makeChangePlanUserUseCase() {
  const prismaUsersRepository = new PrismaUsersRepository()
  const changePlanUserUseCase = new ChangePlanUserUseCase(prismaUsersRepository)

  return changePlanUserUseCase
}
