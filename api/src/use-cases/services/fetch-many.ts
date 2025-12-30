import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import type { ServicesRepository } from '@/repositories/services-repository'
import type { Services } from '@prisma/client'

interface FetchManyServicesUseCaseRequest {
  userId: string
}

interface FetchManyServicesUseCaseResponse {
  services: Services[]
}

export class FetchManyServicesUseCase {
  constructor(private servicesRepository: ServicesRepository) {}

  async execute(
    request: FetchManyServicesUseCaseRequest
  ): Promise<FetchManyServicesUseCaseResponse> {
    const services = await this.servicesRepository.fetchMany(request.userId)

    if (!services) {
      throw new ResourceNotFoundError()
    }

    return { services }
  }
}
