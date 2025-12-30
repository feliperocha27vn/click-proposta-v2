import { NotFoundCustomersError } from '@/errors/not-found-customers'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import type { UsersRepository } from '@/repositories/users-respository'
import type { Customers } from '@prisma/client'

interface FetchCustomersUseCaseRequest {
  userId: string
}

interface FetchCustomersUseCaseReply {
  customers: Customers[]
}

export class FetchCustomersUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
  }: FetchCustomersUseCaseRequest): Promise<FetchCustomersUseCaseReply> {
    const user = await this.usersRepository.getById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    const customers = await this.usersRepository.fetchCustomers(userId)

    if (!customers) {
      throw new NotFoundCustomersError()
    }

    return { customers }
  }
}
