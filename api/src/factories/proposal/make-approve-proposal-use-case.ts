import { PrismaProposalRepository } from '@/repositories/prisma/proposal-repository'
import { ApproveProposalUseCase } from '@/use-cases/proposal/approve-proposal'

export function makeApproveProposalUseCase() {
  const prismaProposalRepository = new PrismaProposalRepository()
  const approveProposalUseCase = new ApproveProposalUseCase(
    prismaProposalRepository
  )

  return approveProposalUseCase
}
