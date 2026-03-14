import { PrismaBudgetsRepository } from '@/repositories/prisma/prisma-budgets-repository'
import { PrismaProposalRepository } from '@/repositories/prisma/proposal-repository'
import { GetProposalAndBudgetTotalValueUseCase } from '@/use-cases/proposal/get-proposal-and-budget-total-value-use-case'

export function makeGetProposalAndBudgetTotalValueUseCase() {
  const proposalRepository = new PrismaProposalRepository()
  const budgetsRepository = new PrismaBudgetsRepository()

  const useCase = new GetProposalAndBudgetTotalValueUseCase(
    proposalRepository,
    budgetsRepository
  )

  return useCase
}
