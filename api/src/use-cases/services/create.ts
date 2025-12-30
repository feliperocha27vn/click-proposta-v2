import type { ServicesRepository } from '@/repositories/services-repository'

type CreateServiceUseCaseRequest = {
  name: string
  description?: string
  userId: string
}

export class CreateServiceUseCase {
  constructor(private servicesRepository: ServicesRepository) {}

  async execute({
    name,
    description,
    userId,
  }: CreateServiceUseCaseRequest): Promise<void> {
    await this.servicesRepository.create({
      name,
      description,
      userId,
    })
  }
}
