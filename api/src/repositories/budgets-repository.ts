import type { Budgets, Prisma } from '@prisma/client'

export interface BudgetsRepository {
  create(data: Prisma.BudgetsUncheckedCreateInput): Promise<Budgets>
  getById(budgetId: string): Promise<Budgets | null>
  fetchMany(usersId: string, pageIndex: number): Promise<Budgets[]>
}
