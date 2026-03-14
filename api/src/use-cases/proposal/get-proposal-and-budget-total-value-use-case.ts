import type { ProposalRepository } from '@/repositories/proposal-repository'
import type { BudgetsRepository } from '@/repositories/budgets-repository'

interface GetProposalAndBudgetTotalValueUseCaseRequest {
  userId: string
}

interface GetProposalAndBudgetTotalValueUseCaseResponse {
  totalValue: number
}

export class GetProposalAndBudgetTotalValueUseCase {
  constructor(
    private proposalRepository: ProposalRepository,
    private budgetsRepository: BudgetsRepository
  ) {}

  async execute({
    userId,
  }: GetProposalAndBudgetTotalValueUseCaseRequest): Promise<GetProposalAndBudgetTotalValueUseCaseResponse> {
    const [proposalsTotal, budgetsTotal] = await Promise.all([
      this.proposalRepository.sumTotalValue(userId),
      this.budgetsRepository.sumTotalValue(userId),
    ])

    return {
      totalValue: proposalsTotal + budgetsTotal
    }
  }
}
