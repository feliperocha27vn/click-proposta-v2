import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import type { UsersRepository } from '@/repositories/users-respository'
import type { Customers } from '@prisma/client'

interface SearchByNameAndEmalUseCaseRequest {
  search: string
  userId: string
}

interface SearchByNameAndEmalUseCaseResponse {
  customers: Customers[]
}

export class SearchByNameAndEmalUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    search,
    userId,
  }: SearchByNameAndEmalUseCaseRequest): Promise<SearchByNameAndEmalUseCaseResponse> {
    const customers = await this.usersRepository.searchByNameAndEmail(
      search,
      userId
    )

    if (!customers) {
      throw new ResourceNotFoundError()
    }

    return {
      customers,
    }
  }
}
