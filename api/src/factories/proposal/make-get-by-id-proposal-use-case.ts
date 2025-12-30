import { PrismaProposalRepository } from '@/repositories/prisma/proposal-repository'
import { GetProposalByIdUseCase } from '@/use-cases/proposal/get-by-id'

export function makeGetByIdProposalUseCase() {
  const prismaProposalsRepository = new PrismaProposalRepository()
  const getProposalByIdUseCase = new GetProposalByIdUseCase(
    prismaProposalsRepository
  )

  return getProposalByIdUseCase
}
