import type { Prisma, Services } from '@prisma/client'

export type ServicesRepository = {
  create(data: Prisma.ServicesUncheckedCreateInput): Promise<void>
  fetchMany(userId: string): Promise<Services[] | null>
  delete(userId: string, serviceId: string): Promise<void>
  update(
    userId: string,
    serviceId: string,
    data: Prisma.ServicesUncheckedUpdateInput
  ): Promise<void>
}
