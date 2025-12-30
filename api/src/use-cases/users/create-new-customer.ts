import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import type { UsersRepository } from '@/repositories/users-respository'
import type { Customers } from '@prisma/client'

interface CreateNewCostumerUseCaseRequest {
  userId: string
  name: string
  email: string
  phone: string
}

interface CreateNewCostumerUseCaseReply {
  customer: Customers
}

export class CreateNewCostumerUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
    name,
    email,
    phone,
  }: CreateNewCostumerUseCaseRequest): Promise<CreateNewCostumerUseCaseReply> {
    const user = await this.usersRepository.getById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    const customer = await this.usersRepository.createNewCostumer({
      email,
      name,
      phone,
      userId,
    })

    return {
      customer,
    }
  }
}
