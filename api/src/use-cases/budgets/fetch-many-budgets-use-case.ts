import { NotFoundBudgets } from '@/errors/not-found-budgets'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import type { BudgetsRepository } from '@/repositories/budgets-repository'
import type { CustomerRepository } from '@/repositories/customer-repository'
import type { UsersRepository } from '@/repositories/users-respository'

interface FetchManyBudgetsUseCaseRequest {
  usersId: string
  pageIndex: number
}

interface FetchManyBudgetsUseCaseResponse {
  budgets: {
    id: string
    total: number
    status: string
    customerName: string
  }[]
}

export class FetchManyBudgetsUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private budgetsRepository: BudgetsRepository,
    private customersRepository: CustomerRepository
  ) {}

  async execute({
    usersId,
    pageIndex,
  }: FetchManyBudgetsUseCaseRequest): Promise<FetchManyBudgetsUseCaseResponse> {
    const user = await this.usersRepository.getById(usersId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    const budgetsUser = await this.budgetsRepository.fetchMany(
      usersId,
      pageIndex
    )

    if (budgetsUser.length === 0) {
      throw new NotFoundBudgets()
    }

    const budgets = await Promise.all(
      budgetsUser.map(async item => {
        const customer = await this.customersRepository.getById(
          item.customersId
        )

        if (!customer) {
          throw new ResourceNotFoundError()
        }

        return {
          id: item.id,
          total: item.total.toNumber(),
          status: item.status,
          customerName: customer.name,
        }
      })
    )

    return {
      budgets,
    }
  }
}
