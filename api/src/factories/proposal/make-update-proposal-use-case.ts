import { PrismaProposalRepository } from '@/repositories/prisma/proposal-repository'
import { UpdateProposalUseCase } from '@/use-cases/proposal/update'

export function makeUpdateProposalUseCase() {
  const prismaProposalRepository = new PrismaProposalRepository()
  const updateProposalUseCase = new UpdateProposalUseCase(
    prismaProposalRepository
  )

  return updateProposalUseCase
}
