import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import type { UsersRepository } from '@/repositories/users-respository'

interface GetDataForCreatePdfProductUseCaseRequest {
  userId: string
}

interface GetDataForCreatePdfProductUseCaseResponse {
  user: {
    phone: string
    email: string
    avatarUrl: string
    cnpj: string
    address: string
  }
}

export class GetDataForCreatePdfProductUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute({
    userId,
  }: GetDataForCreatePdfProductUseCaseRequest): Promise<GetDataForCreatePdfProductUseCaseResponse> {
    const user = await this.usersRepository.getDataForCreatePdfProduct(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    return {
      user: {
        phone: user.phone ?? '',
        email: user.email ?? '',
        avatarUrl: user.avatarUrl ?? '',
        cnpj: user.cnpj ?? '',
        address: user.address ?? '',
      },
    }
  }
}
