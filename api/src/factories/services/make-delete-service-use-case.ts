import { PrismaServicesRepository } from "@/repositories/prisma/services-repository"
import { DeleteServiceUseCase } from "@/use-cases/services/delete"

export function makeDeleteServiceUseCase() {
    const prismaServiceRepository = new PrismaServicesRepository()
    const deleteServiceUseCase = new DeleteServiceUseCase(prismaServiceRepository)
    
    return deleteServiceUseCase
}