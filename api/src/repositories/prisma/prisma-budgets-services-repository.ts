import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'
import type { BudgetsServicesRepository } from '../budgets-services-repository'

export class PrismaBudgetsServicesRepository
  implements BudgetsServicesRepository
{
  async createMany(data: Prisma.BudgetsServicesCreateManyInput[]) {
    const budgetsServices = await prisma.budgetsServices.createManyAndReturn({
      data,
    })

    return budgetsServices
  }

  async fetchManyByBudgetId(budgetId: string) {
    const budgetsServices = await prisma.budgetsServices.findMany({
      where: { budgetsId: budgetId },
    })

    return budgetsServices
  }
}
