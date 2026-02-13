import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import type { BudgetsRepository } from '@/repositories/budgets-repository'
import type { BudgetsServicesRepository } from '@/repositories/budgets-services-repository'
import type { CustomerRepository } from '@/repositories/customer-repository'
import type { UsersRepository } from '@/repositories/users-respository'

interface GetInfoForRegenaretePdfUseCaseRequest {
  budgetId: string
  usersId: string
}

interface GetInfoForRegenaretePdfUseCaseResponse {
  imgUrl: string | null
  nameUser: string | null
  nameCustomer: string
  emailCustomer: string
  phoneCustomer: string
  total: string
  services: {
    id: string
    title: string
    description: string
    budgetsId: string
  }[]
}

export class GetInfoForRegenaretePdfUseCase {
  constructor(
    private budgetsRepository: BudgetsRepository,
    private usersRepository: UsersRepository,
    private budgetsServicesRepository: BudgetsServicesRepository,
    private customersRepository: CustomerRepository
  ) {}

  async execute({
    budgetId,
    usersId,
  }: GetInfoForRegenaretePdfUseCaseRequest): Promise<GetInfoForRegenaretePdfUseCaseResponse> {
    const user = await this.usersRepository.getById(usersId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    const budget = await this.budgetsRepository.getById(budgetId)

    if (!budget) {
      throw new ResourceNotFoundError()
    }

    const customer = await this.customersRepository.getById(budget.customersId)

    if (!customer) {
      throw new ResourceNotFoundError()
    }

    const budgetsServices =
      await this.budgetsServicesRepository.fetchManyByBudgetId(budgetId)

    return {
      imgUrl: user.avatarUrl,
      nameUser: user.name,
      nameCustomer: customer.name,
      emailCustomer: customer.email,
      phoneCustomer: customer.phone,
      total: budget.total.toString(),
      services: budgetsServices,
    }
  }
}
