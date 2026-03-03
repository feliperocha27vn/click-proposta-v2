import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import type { UsersRepository } from '@/repositories/users-respository'
import type { User } from '@prisma/client'

interface GetUserByIdUseCaseRequest {
  phone: string
}

interface GetUserByIdUseCaseReply {
  user: Partial<User>
}

export class GetUserByPhoneUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    phone,
  }: GetUserByIdUseCaseRequest): Promise<GetUserByIdUseCaseReply> {
    const user = await this.usersRepository.getUserByPhone(phone)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    return { user }
  }
}
