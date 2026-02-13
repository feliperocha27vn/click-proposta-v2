import { NotFoundCustomersError } from '@/errors/not-found-customers'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import type { BudgetsRepository } from '@/repositories/budgets-repository'
import type { BudgetsServicesRepository } from '@/repositories/budgets-services-repository'
import type { CustomerRepository } from '@/repositories/customer-repository'
import type { UsersRepository } from '@/repositories/users-respository'
import type { Budgets } from '@prisma/client'

interface CreateNewBudgetUseCaseRequest {
  customerId: string
  userId: string
  total: number
  services: {
    id: string
    title: string
    description: string
  }[]
}

interface CreateNewBudgetUseCaseReply {
  budget: Budgets
}

export class CreateNewBudgetUseCase {
  constructor(
    private budgetsRepository: BudgetsRepository,
    private usersRepository: UsersRepository,
    private budgetsServicesRepository: BudgetsServicesRepository,
    private customersRepository: CustomerRepository
  ) {}

  async execute({
    userId,
    customerId,
    total,
    services,
  }: CreateNewBudgetUseCaseRequest): Promise<CreateNewBudgetUseCaseReply> {
    const user = await this.usersRepository.getById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    const customer = await this.customersRepository.getById(customerId)

    if (!customer) {
      throw new NotFoundCustomersError()
    }

    const budget = await this.budgetsRepository.create({
      customersId: customerId,
      usersId: userId,
      total,
    })

    await this.budgetsServicesRepository.createMany(
      services.map(service => ({
        budgetsId: budget.id,
        title: service.title,
        description: service.description,
      }))
    )

    return {
      budget,
    }
  }
}
