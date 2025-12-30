import type { ServicesRepository } from '@/repositories/services-repository'

interface UpdateServiceUseCaseRequest {
  serviceId: string
  userId: string
  name?: string
  description?: string
}

export class UpdateServiceUseCase {
  constructor(private servicesRepository: ServicesRepository) {}

  async execute({
    userId,
    serviceId,
    name,
    description,
  }: UpdateServiceUseCaseRequest) {
    await this.servicesRepository.update(userId, serviceId, {
      name,
      description,
    })
  }
}
