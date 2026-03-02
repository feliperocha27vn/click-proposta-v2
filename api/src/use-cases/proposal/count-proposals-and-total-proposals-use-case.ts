import type { ProposalRepository } from '@/repositories/proposal-repository'

interface CountProposalsAndTotalProposalsUseCaseRequest {
  userId: string
}

interface CountProposalsAndTotalProposalsUseCaseResponse {
  accepted: number
  total: number
}

export class CountProposalsAndTotalProposalsUseCase {
  constructor(private proposalRepository: ProposalRepository) {}

  async execute({
    userId,
  }: CountProposalsAndTotalProposalsUseCaseRequest): Promise<CountProposalsAndTotalProposalsUseCaseResponse> {
    const { accepted, total } =
      await this.proposalRepository.countAcceptedProposalsAndTotalProposals(
        userId
      )

    return { accepted, total }
  }
}
