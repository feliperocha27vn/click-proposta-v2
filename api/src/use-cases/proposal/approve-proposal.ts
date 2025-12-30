import type { ProposalRepository } from '@/repositories/proposal-repository'

interface ApproveProposalUseCaseRequest {
  proposalId: string
}

export class ApproveProposalUseCase {
  constructor(private proposalRepository: ProposalRepository) {}

  async execute({ proposalId }: ApproveProposalUseCaseRequest) {
    await this.proposalRepository.approveProposal(proposalId)
  }
}
