import type { Prisma } from '@prisma/client'
import { endOfMonth, startOfMonth, subDays } from 'date-fns'
import { prisma } from '@/lib/prisma'
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

  async findCountByDay(userId: string, days: number) {
    const startDate = subDays(new Date(), days)
    startDate.setHours(0, 0, 0, 0)

    const budgets = await prisma.budgets.findMany({
      where: {
        usersId: userId,
        createdAt: {
          gte: startDate,
        },
        status: {
          not: 'DRAFT',
        },
      },
      select: {
        createdAt: true,
      },
    })

    const counts: { [key: string]: number } = {}

    for (const budget of budgets) {
      const date = budget.createdAt.toISOString().split('T')[0]
      counts[date] = (counts[date] || 0) + 1
    }

    return Object.entries(counts).map(([date, count]) => ({
      date: new Date(date),
      count,
    }))
  }

  async sumTotalValue(userId: string) {
    const result = await prisma.budgets.aggregate({
      where: {
        usersId: userId,
        createdAt: {
          gte: startOfMonth(new Date()),
          lte: endOfMonth(new Date()),
        },
        status: {
          not: 'REJECTED',
        },
      },
      _sum: {
        total: true,
      },
    })

    return result._sum.total?.toNumber() || 0
  }
}
