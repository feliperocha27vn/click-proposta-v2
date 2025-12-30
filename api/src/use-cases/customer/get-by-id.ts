import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import type { CustomerRepository } from '@/repositories/customer-repository'
import type { Customers } from '@prisma/client'

interface GetCostumerByIdUseCaseRequest {
  customerId: string
}

interface GetCostumerByIdUseCaseResponse {
  customer: Customers
}

export class GetCostumerByIdUseCase {
  constructor(private customerRepository: CustomerRepository) {}

  async execute({
    customerId,
  }: GetCostumerByIdUseCaseRequest): Promise<GetCostumerByIdUseCaseResponse> {
    const customer = await this.customerRepository.getById(customerId)

    if (!customer) {
      throw new ResourceNotFoundError()
    }

    return { customer }
  }
}
