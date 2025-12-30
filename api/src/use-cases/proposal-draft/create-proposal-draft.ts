import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import type { CustomerRepository } from '@/repositories/customer-repository'
import type { ProposalDraftRepository } from '@/repositories/proposal-draft-repository'
import type { UsersRepository } from '@/repositories/users-respository'

interface CreateProposalDraftUseCaseRequest {
  userId: string
  customerId: string
  title: string
  welcomeDescription: string
  whyUs: string
  challenge: string
  solution: string
  results: string
  userPrompt: string
}

export class CreateProposalDraftUseCase {
  constructor(
    private proposalDraftRepository: ProposalDraftRepository,
    private usersRepository: UsersRepository,
    private customersRepository: CustomerRepository
  ) {}

  async execute({
    userId,
    customerId,
    title,
    welcomeDescription,
    whyUs,
    challenge,
    solution,
    results,
    userPrompt,
  }: CreateProposalDraftUseCaseRequest) {
    const user = await this.usersRepository.getById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    const customer = await this.customersRepository.getById(customerId)

    if (!customer) {
      throw new ResourceNotFoundError()
    }

    await this.proposalDraftRepository.create({
      userId,
      customerId,
      title,
      welcomeDescription,
      whyUs,
      challenge,
      solution,
      results,
      userPrompt,
    })
  }
}
