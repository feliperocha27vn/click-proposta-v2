import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'
import type { ServicesRepository } from '../services-repository'

export class PrismaServicesRepository implements ServicesRepository {
  async create(data: Prisma.ServicesUncheckedCreateInput) {
    await prisma.services.create({
      data,
    })
  }

  async fetchMany(userId: string) {
    const services = await prisma.services.findMany({
      where: {
        userId,
      },
    })

    return services
  }

  async delete(userId: string, serviceId: string) {
      await prisma.services.delete({
        where: {
          userId,
          id: serviceId,
        }
      })
  }

  async update(userId: string, serviceId: string, data: Prisma.ServicesUncheckedUpdateInput) {
    await prisma.services.update({
      where: {
        userId,
        id: serviceId,
      },
      data,
    })
  }
}
