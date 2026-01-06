import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import type { BudgetsRepository } from '@/repositories/budgets-repository'
import type { BudgetsServicesRepository } from '@/repositories/budgets-services-repository'
import type { UsersRepository } from '@/repositories/users-respository'

interface GetByIdBudgetUseCaseRequest {
  usersId: string
  budgetId: string
}

interface GetByIdBudgetUseCaseReply {
  budget: {
    id: string
    total: number
    status: string
    customersId: string
    budgetsServices: {
      id: string
      title: string
      description: string
    }[]
  }
}

export class GetByIdBudgetUseCase {
  constructor(
    private budgetsRepository: BudgetsRepository,
    private usersRepository: UsersRepository,
    private budgetsServicesRepository: BudgetsServicesRepository
  ) {}

  async execute({
    budgetId,
    usersId,
  }: GetByIdBudgetUseCaseRequest): Promise<GetByIdBudgetUseCaseReply> {
    const user = await this.usersRepository.getById(usersId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    const budget = await this.budgetsRepository.getById(budgetId)

    if (!budget) {
      throw new ResourceNotFoundError()
    }

    const budgetsServices =
      await this.budgetsServicesRepository.fetchManyByBudgetId(budgetId)

    return {
      budget: {
        id: budget.id,
        total: Number(budget.total),
        status: budget.status,
        customersId: budget.customersId,
        budgetsServices,
      },
    }
  }
}
