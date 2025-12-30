import { PrismaProposalRepository } from '@/repositories/prisma/proposal-repository'
import { ConfirmSendingProposalUseCase } from '@/use-cases/proposal/confirm-sending'

export function makeConfirmSendingProposalUseCase() {
  const prismaProposalRepository = new PrismaProposalRepository()
  const confirmSendingProposalUseCase = new ConfirmSendingProposalUseCase(
    prismaProposalRepository
  )

  return confirmSendingProposalUseCase
}
