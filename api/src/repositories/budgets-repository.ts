import type { Budgets, Prisma } from '@prisma/client'

export interface BudgetsRepository {
  create(data: Prisma.BudgetsUncheckedCreateInput): Promise<Budgets>
}
