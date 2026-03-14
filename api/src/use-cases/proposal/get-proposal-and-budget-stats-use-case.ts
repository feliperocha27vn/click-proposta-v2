import type { ProposalRepository } from '@/repositories/proposal-repository'
import type { BudgetsRepository } from '@/repositories/budgets-repository'
import { subDays, format } from 'date-fns'

interface GetProposalAndBudgetStatsUseCaseRequest {
  userId: string
}

interface GetProposalAndBudgetStatsUseCaseResponse {
  stats: {
    date: string
    count: number
  }[]
}

export class GetProposalAndBudgetStatsUseCase {
  constructor(
    private proposalRepository: ProposalRepository,
    private budgetsRepository: BudgetsRepository
  ) {}

  async execute({
    userId,
  }: GetProposalAndBudgetStatsUseCaseRequest): Promise<GetProposalAndBudgetStatsUseCaseResponse> {
    const days = 15
    const [proposalsByDay, budgetsByDay] = await Promise.all([
      this.proposalRepository.findCountByDay(userId, days),
      this.budgetsRepository.findCountByDay(userId, days),
    ])

    const stats: { date: string; count: number }[] = []

    for (let i = 0; i < days; i++) {
      const date = subDays(new Date(), days - 1 - i)
      const dateKey = date.toISOString().split('T')[0]
      
      const proposalsCount = proposalsByDay.find(p => p.date.toISOString().split('T')[0] === dateKey)?.count || 0
      const budgetsCount = budgetsByDay.find(b => b.date.toISOString().split('T')[0] === dateKey)?.count || 0
      
      stats.push({
        date: format(date, 'dd/MM'),
        count: proposalsCount + budgetsCount
      })
    }

    return { stats }
  }
}
