import { NotFoundProposal } from '@/errors/not-found-proposals'
import type { ProposalRepository } from '@/repositories/proposal-repository'

interface RecusedProposalUseCaseRequest {
  proposalId: string
}

export class RecusedProposalUseCase {
  constructor(private proposalRepository: ProposalRepository) {}

  async execute({ proposalId }: RecusedProposalUseCaseRequest) {
    const proposal = await this.proposalRepository.getById(proposalId)

    if (!proposal) {
      throw new NotFoundProposal()
    }

    await this.proposalRepository.recusedProposal(proposal.id)
  }
}
