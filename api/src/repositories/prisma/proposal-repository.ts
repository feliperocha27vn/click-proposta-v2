import type { Prisma } from '@prisma/client'
import { endOfMonth, startOfMonth, subDays } from 'date-fns'
import { prisma } from '@/lib/prisma'
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

  async countAcceptedProposalsAndTotalProposals(
    userId: string
  ): Promise<{ accepted: number; total: number }> {
    const acceptedProposals = await prisma.proposal.count({
      where: {
        userId,
        status: 'APPROVED',
      },
    })

    const totalProposals = await prisma.proposal.count({
      where: {
        userId,
      },
    })

    const totalBudgets = await prisma.budgets.count({
      where: {
        usersId: userId,
      },
    })

    const acceptedBudgets = await prisma.budgets.count({
      where: {
        usersId: userId,
        status: 'APPROVED',
      },
    })

    return {
      accepted: acceptedProposals + acceptedBudgets,
      total: totalProposals + totalBudgets,
    }
  }

  async findCountByDay(userId: string, days: number) {
    const startDate = subDays(new Date(), days)
    startDate.setHours(0, 0, 0, 0)

    const proposals = await prisma.proposal.findMany({
      where: {
        userId,
        createdAt: {
          gte: startDate,
        },
        status: {
          not: 'DRAFT',
        },
      },
      select: {
        createdAt: true,
      },
    })

    const counts: { [key: string]: number } = {}

    for (const proposal of proposals) {
      const date = proposal.createdAt.toISOString().split('T')[0]
      counts[date] = (counts[date] || 0) + 1
    }

    return Object.entries(counts).map(([date, count]) => ({
      date: new Date(date),
      count,
    }))
  }
  async sumTotalValue(userId: string) {
    const result = await prisma.proposal.aggregate({
      where: {
        userId,
        createdAt: {
          gte: startOfMonth(new Date()),
          lte: endOfMonth(new Date()),
        },
        status: {
          not: 'REJECTED',
        },
      },
      _sum: {
        totalPrice: true,
      },
    })

    return result._sum.totalPrice?.toNumber() || 0
  }
}
