import { PrismaBudgetsRepository } from '@/repositories/prisma/prisma-budgets-repository'
import { PrismaProposalRepository } from '@/repositories/prisma/proposal-repository'
import { GetProposalAndBudgetStatsUseCase } from '@/use-cases/proposal/get-proposal-and-budget-stats-use-case'

export function makeGetProposalAndBudgetStatsUseCase() {
  const proposalRepository = new PrismaProposalRepository()
  const budgetsRepository = new PrismaBudgetsRepository()
  const useCase = new GetProposalAndBudgetStatsUseCase(
    proposalRepository,
    budgetsRepository
  )

  return useCase
}
