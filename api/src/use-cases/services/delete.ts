import { ServicesRepository } from "@/repositories/services-repository";

interface DeleteServiceUseCaseRequest {
    serviceId: string;
    userId: string;
}

export class DeleteServiceUseCase {
    constructor(private servicesRepository: ServicesRepository) {}

  async execute({userId, serviceId}: DeleteServiceUseCaseRequest){
    await this.servicesRepository.delete(userId, serviceId)
  }
}