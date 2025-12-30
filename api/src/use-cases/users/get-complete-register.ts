import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import type { UsersRepository } from '@/repositories/users-respository'

interface GetCompleteRegisterUserUseCaseRequest {
  userId: string
}

export class GetCompleteRegisterUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ userId }: GetCompleteRegisterUserUseCaseRequest) {
    const user = await this.usersRepository.getCompleteRegister(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    const isRegisterComplete = user.isRegisterComplete

    return { isRegisterComplete }
  }
}
