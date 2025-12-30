import { DataPaymentIncompleteError } from '@/errors/data-payment-incomplete'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import type { UsersRepository } from '@/repositories/users-respository'

interface GetDataForPaymentUseCaseRequest {
  userId: string
}

interface GetDataForPaymentUseCaseReply {
  name: string
  email: string
  phone: string
  cpf: string
}

export class GetDataForPaymentUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
  }: GetDataForPaymentUseCaseRequest): Promise<GetDataForPaymentUseCaseReply> {
    const userDataPayment = await this.usersRepository.getDataForPayment(userId)

    if (!userDataPayment) {
      throw new ResourceNotFoundError()
    }

    if (
      !userDataPayment.name ||
      !userDataPayment.phone ||
      !userDataPayment.cpf ||
      !userDataPayment.email
    ) {
      throw new DataPaymentIncompleteError()
    }

    return {
      name: userDataPayment.name,
      email: userDataPayment.email,
      phone: userDataPayment.phone,
      cpf: userDataPayment.cpf,
    }
  }
}
