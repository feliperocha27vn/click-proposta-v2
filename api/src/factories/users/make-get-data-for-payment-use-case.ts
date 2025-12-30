import { PrismaUsersRepository } from '@/repositories/prisma/users-repository'
import { GetDataForPaymentUseCase } from '@/use-cases/users/get-data-for-payment'

export function makeGetDataForPaymentUseCase() {
  const prismaUsersRepository = new PrismaUsersRepository()
  const getDataForPaymentUseCase = new GetDataForPaymentUseCase(
    prismaUsersRepository
  )

  return getDataForPaymentUseCase
}
