import { PrismaUsersRepository } from '@/repositories/prisma/users-repository'
import { GetDataForCreatePdfProductUseCase } from '@/use-cases/users/get-data-for-create-pdf-product-use-case'

export function makeGetDataForCreatePdfProductUseCase() {
  const prismaUsersRepository = new PrismaUsersRepository()
  const getDataForCreatePdfProductUseCase =
    new GetDataForCreatePdfProductUseCase(prismaUsersRepository)

  return getDataForCreatePdfProductUseCase
}
