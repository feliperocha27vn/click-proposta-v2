import type { ProposalRepository } from '@/repositories/proposal-repository'

interface UpdateProposalUseCaseRequest {
  id: string
  userId: string
  title?: string
  welcomeDescription?: string | null
  whyUs?: string | null
  challenge?: string | null
  solution?: string | null
  results?: string | null
  discount?: number
  totalPrice?: number
}

export class UpdateProposalUseCase {
  constructor(private proposalRepository: ProposalRepository) {}

  async execute({ id, userId, ...data }: UpdateProposalUseCaseRequest) {
    await this.proposalRepository.update(id, userId, data)
  }
}
