import { NotFoundProposal } from '@/errors/not-found-proposals'
import type {
  ProposalRepository,
  ProposalWithCustomer,
} from '@/repositories/proposal-repository'

interface GetProposalByIdUseCaseRequest {
  id: string
}

interface GetProposalByIdUseCaseResponse {
  proposal: ProposalWithCustomer
}

export class GetProposalByIdUseCase {
  constructor(private proposalsRepository: ProposalRepository) {}

  async execute({
    id,
  }: GetProposalByIdUseCaseRequest): Promise<GetProposalByIdUseCaseResponse> {
    const proposal = await this.proposalsRepository.getById(id)

    if (!proposal) {
      throw new NotFoundProposal()
    }

    return {
      proposal,
    }
  }
}
