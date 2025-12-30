import { PrismaUsersRepository } from '@/repositories/prisma/users-repository'
import { SearchByNameAndEmalUseCase } from '@/use-cases/users/search-by-name-email'

export function makeSearchByNameEmailUseCase() {
  const prismaUsersRepository = new PrismaUsersRepository()
  const searchByNameAndEmailUseCase = new SearchByNameAndEmalUseCase(
    prismaUsersRepository
  )

  return searchByNameAndEmailUseCase
}
