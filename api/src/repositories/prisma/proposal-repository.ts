import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'
import type {
  ProposalRepository,
  ServicesProposal,
} from '../proposal-repository'

export class PrismaProposalRepository implements ProposalRepository {
  async create(
    data: Prisma.ProposalUncheckedCreateInput,
    services: ServicesProposal[]
  ) {
    const proposal = await prisma.proposal.create({
      data: {
        ...data,
        ProposalServices: {
          create: services,
        },
      },
    })

    return proposal
  }
  async fetchProposalMinimalDetails(userId: string) {
    const proposalsMinimalDetails = await prisma.proposal.findMany({
      where: {
        userId,
      },
      select: {
        customer: {
          select: {
            name: true,
          },
        },
        title: true,
        totalPrice: true,
        id: true,
        status: true,
      },
    })

    return proposalsMinimalDetails.map(proposal => ({
      id: proposal.id,
      name: proposal.customer.name,
      title: proposal.title,
      totalPrice: proposal.totalPrice.toString(),
      status: proposal.status,
    }))
  }

  async getById(id: string) {
    const proposal = await prisma.proposal.findUniqueOrThrow({
      where: {
        id,
      },
      include: {
        ProposalServices: {
          select: {
            price: true,
            service: {
              select: {
                name: true,
              },
            },
          },
        },
        customer: {
          select: {
            name: true,
          },
        },
      },
    })

    return {
      id: proposal.id,
      urlLogoImage: proposal.urlLogoImage,
      title: proposal.title,
      customersId: proposal.customersId,
      welcomeDescription: proposal.welcomeDescription,
      whyUs: proposal.whyUs,
      challenge: proposal.challenge,
      solution: proposal.solution,
      results: proposal.results,
      discount: proposal.discount,
      totalPrice: proposal.totalPrice.toString(),
      userId: proposal.userId,
      customerName: proposal.customer.name,
      services: proposal.ProposalServices.map(({ price, service }) => ({
        price: price.toString(),
        name: service.name,
      })),
    }
  }

  async update(
    id: string,
    userId: string,
    data: Prisma.ProposalUncheckedUpdateInput
  ) {
    await prisma.proposal.update({
      where: { id, userId },
      data,
    })
  }

  async confirmSending(id: string, userId: string) {
    await prisma.proposal.update({
      where: { id, userId },
      data: { status: 'SENT' },
    })
  }

  async approveProposal(id: string) {
    await prisma.proposal.update({
      where: { id },
      data: { status: 'APPROVED' },
    })
  }

  async recusedProposal(id: string) {
    await prisma.proposal.update({
      where: { id },
      data: { status: 'REJECTED' },
    })
  }
}
