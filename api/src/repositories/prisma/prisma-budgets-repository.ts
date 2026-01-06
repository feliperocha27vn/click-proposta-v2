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

  async getById(id: string) {
    const budget = await prisma.budgets.findUnique({
      where: { id },
    })

    return budget
  }

  async fetchMany(usersId: string, pageIndex: number) {
    const budgetsByUser = await prisma.budgets.findMany({
      where: {
        usersId,
      },
      skip: pageIndex * 10,
      take: 10,
    })

    return budgetsByUser
  }
}
