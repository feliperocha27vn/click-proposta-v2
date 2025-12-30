import type { ProposalRepository } from '@/repositories/proposal-repository'

interface ConfirmSendingProposalUseCaseRequest {
  proposalId: string
  userId: string
}

export class ConfirmSendingProposalUseCase {
  constructor(private proposalRepository: ProposalRepository) {}

  async execute({ proposalId, userId }: ConfirmSendingProposalUseCaseRequest) {
    await this.proposalRepository.confirmSending(proposalId, userId)
  }
}
