import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import type { BudgetsRepository } from '@/repositories/budgets-repository'
import type { BudgetsServicesRepository } from '@/repositories/budgets-services-repository'
import type { CustomerRepository } from '@/repositories/customer-repository'
import type { UsersRepository } from '@/repositories/users-respository'

interface GetPublicBudgetUseCaseRequest {
  budgetId: string
}

interface GetPublicBudgetUseCaseReply {
  budget: {
    id: string
    title: string
    description: string
    total: number
    status: string
    createdAt: Date
    customer: {
      name: string
    }
    user: {
      name: string | null
      avatarUrl: string | null
    }
    budgetsServices: {
      id: string
      title: string
      description: string
    }[]
  }
}

export class GetPublicBudgetUseCase {
  constructor(
    private budgetsRepository: BudgetsRepository,
    private usersRepository: UsersRepository,
    private budgetsServicesRepository: BudgetsServicesRepository,
    private customersRepository: CustomerRepository
  ) {}

  async execute({
    budgetId,
  }: GetPublicBudgetUseCaseRequest): Promise<GetPublicBudgetUseCaseReply> {
    const budget = await this.budgetsRepository.getById(budgetId)

    if (!budget) {
      throw new ResourceNotFoundError()
    }

    const [budgetsServices, customer, user] = await Promise.all([
      this.budgetsServicesRepository.fetchManyByBudgetId(budgetId),
      this.customersRepository.getById(budget.customersId),
      this.usersRepository.getById(budget.usersId),
    ])

    if (!customer || !user) {
      throw new ResourceNotFoundError()
    }

    return {
      budget: {
        id: budget.id,
        // The current budget model in schema.prisma doesn't seem to have a 'title' or 'description' field on the Budget itself?
        // Let me re-check schema.prisma.
        // Waiting for check result before finalizing this file content fully, but writing provisional code.
        // Actually, looking at schema.prisma earlier:
        // model Budgets { id, total, status, customersId, usersId, createdAt, updatedAt }
        // It DOES NOT have a title. The title seems to be either implicit or missing.
        // However, 'get-by-id-budget-use-case.ts' returned:
        // budget: { id, total, status, ... budgetsServices: [...] }
        // It did NOT return a title for the budget itself.
        // I will stick to what is available.
        title: `Orçamento para ${customer.name}`, // Fallback title
        description: '', // No description on budget model
        total: Number(budget.total),
        status: budget.status,
        createdAt: budget.createdAt,
        customer: {
          name: customer.name,
        },
        user: {
          name: user.name,
          avatarUrl: user.avatarUrl,
        },
        budgetsServices,
      },
    }
  }
}
