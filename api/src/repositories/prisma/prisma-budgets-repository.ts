import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'
import type { BudgetsRepository } from '../budgets-repository'

export class PrismaBudgetsRepository implements BudgetsRepository {
  async create(data: Prisma.BudgetsUncheckedCreateInput) {
    const budgets = await prisma.budgets.create({
      data,
    })

    return budgets
  }
}
