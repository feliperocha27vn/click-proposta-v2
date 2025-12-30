import { PrismaServicesRepository } from "@/repositories/prisma/services-repository";
import { UpdateServiceUseCase } from "@/use-cases/services/update";

export function makeUpdateServiceUseCase() {
    const prismaServiceRepository = new PrismaServicesRepository()
    const updateServiceUseCase = new UpdateServiceUseCase(prismaServiceRepository)

    return updateServiceUseCase
}