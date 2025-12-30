import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import type { CustomerRepository } from '@/repositories/customer-repository'
import type { ProposalDraftRepository } from '@/repositories/proposal-draft-repository'
import type { UsersRepository } from '@/repositories/users-respository'

export interface GetLastDraftProposalRequest {
  customerId: string
  userId: string
}

export interface GetLastDraftProposalReply {
  proposalDraft: {
    title: string
    welcomeDescription: string
    whyUs: string
    challenge: string
    solution: string
    results: string
  }
}

export class GetLastDraftProposal {
  constructor(
    private proposalDraftRepository: ProposalDraftRepository,
    private userRepository: UsersRepository,
    private customerRepository: CustomerRepository
  ) {}

  async execute({
    customerId,
    userId,
  }: GetLastDraftProposalRequest): Promise<GetLastDraftProposalReply> {
    const user = await this.userRepository.getById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    const customer = await this.customerRepository.getById(customerId)

    if (!customer) {
      throw new ResourceNotFoundError()
    }

    const proposalDraft =
      await this.proposalDraftRepository.getLastProposalDraftByCustomerId(
        customerId,
        userId
      )

    if (!proposalDraft) {
      throw new ResourceNotFoundError()
    }

    return {
      proposalDraft: {
        title: proposalDraft.title,
        welcomeDescription: proposalDraft.welcomeDescription,
        whyUs: proposalDraft.whyUs,
        challenge: proposalDraft.challenge,
        solution: proposalDraft.solution,
        results: proposalDraft.results,
      },
    }
  }
}
