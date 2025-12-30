import type { Prisma, ProposalDraft } from '@prisma/client'

export interface ProposalDraftRepository {
  create(data: Prisma.ProposalDraftUncheckedCreateInput): Promise<void>
  getLastProposalDraftByCustomerId(
    customerId: string,
    userId: string
  ): Promise<ProposalDraft | null>
}
