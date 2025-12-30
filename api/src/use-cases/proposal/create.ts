import { ExceededPlanProposal } from '@/errors/exceeded-plan-proposal'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import type { ProposalRepository } from '@/repositories/proposal-repository'
import type { UsersRepository } from '@/repositories/users-respository'
import type { Proposal } from '@prisma/client'

interface CreateProposalUseCaseRequest {
  urlLogoImage: string | null
  title: string
  customersId: string
  welcomeDescription: string
  whyUs: string
  challenge: string
  solution: string
  services: {
    price: number
    servicesId: string
  }[]
  results: string
  discount: number
  userId: string
}

interface CreateProposalUseCaseReply {
  proposal: Proposal
}

export class CreateProposalUseCase {
  constructor(
    private proposalRepository: ProposalRepository,
    private usersRepository: UsersRepository
  ) {}

  async execute({
    urlLogoImage,
    title,
    customersId,
    welcomeDescription,
    whyUs,
    challenge,
    solution,
    services,
    results,
    discount,
    userId,
  }: CreateProposalUseCaseRequest): Promise<CreateProposalUseCaseReply> {
    const countProposalsByUser =
      await this.usersRepository.countProposals(userId)
    const user = await this.usersRepository.getById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    if (countProposalsByUser >= 2 && user.plan === 'FREE') {
      throw new ExceededPlanProposal()
    }

    const subtotal = services.reduce((acc, service) => acc + service.price, 0)
    const discountAmount = (subtotal * discount) / 100
    const totalPrice = subtotal - discountAmount

    const proposal = await this.proposalRepository.create(
      {
        urlLogoImage,
        title,
        customersId,
        welcomeDescription,
        whyUs,
        challenge,
        solution,
        results,
        discount,
        totalPrice,
        userId,
      },
      services
    )

    return { proposal }
  }
}
