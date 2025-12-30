import type { BudgetsServices, Prisma } from '@prisma/client'

export interface BudgetsServicesRepository {
  createMany(
    data: Prisma.BudgetsServicesCreateManyInput[]
  ): Promise<BudgetsServices[]>
}
