import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'
import type { ProposalDraftRepository } from '../proposal-draft-repository'

export class PrismaProposalDraftRepository implements ProposalDraftRepository {
  async create(data: Prisma.ProposalDraftUncheckedCreateInput) {
    await prisma.proposalDraft.create({
      data,
    })
  }

  async getLastProposalDraftByCustomerId(customerId: string, userId: string) {
    const draftProposal = await prisma.proposalDraft.findFirst({
      where: { customerId, userId },
      orderBy: { createdAt: 'desc' },
    })

    return draftProposal
  }
}
