import type { ProposalRepository } from '@/repositories/proposal-repository'

interface FetchProposalMinimalDetailsUseCaseRequest {
  userId: string
}

interface FetchProposalMinimalDetailsUseCaseReply {
  id: string
  name: string
  title: string
  totalPrice: string
  status: 'DRAFT' | 'SENT' | 'APPROVED' | 'REJECTED'
}

export class FetchProposalMinimalDetailsUseCase {
  constructor(private proposalRepository: ProposalRepository) {}

  async execute({
    userId,
  }: FetchProposalMinimalDetailsUseCaseRequest): Promise<
    FetchProposalMinimalDetailsUseCaseReply[]
  > {
    const proposals =
      await this.proposalRepository.fetchProposalMinimalDetails(userId)
    return proposals
  }
}
