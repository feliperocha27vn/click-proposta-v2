import { PrismaProposalRepository } from '@/repositories/prisma/proposal-repository'
import { RecusedProposalUseCase } from '@/use-cases/proposal/recused-proposal'

export function makeRecusedProposalUseCase() {
  const prismaProposalRepository = new PrismaProposalRepository()
  const recusedProposalUseCase = new RecusedProposalUseCase(
    prismaProposalRepository
  )
  return recusedProposalUseCase
}
