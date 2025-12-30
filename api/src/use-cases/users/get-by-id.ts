import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import type {
  GetUserById,
  UsersRepository,
} from '@/repositories/users-respository'

interface GetUserByIdUseCaseRequest {
  userId: string
}

interface GetUserByIdUseCaseReply {
  user: GetUserById
}

export class GetUserByIdUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
  }: GetUserByIdUseCaseRequest): Promise<GetUserByIdUseCaseReply> {
    const user = await this.usersRepository.getById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    return { user }
  }
}
