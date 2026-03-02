import { PrismaProposalRepository } from '@/repositories/prisma/proposal-repository'
import { CountProposalsAndTotalProposalsUseCase } from '@/use-cases/proposal/count-proposals-and-total-proposals-use-case'

export function makeCountProposalsAndTotalProposalsUseCase() {
  const proposalRepository = new PrismaProposalRepository()
  const countProposalsAndTotalProposalsUseCase =
    new CountProposalsAndTotalProposalsUseCase(proposalRepository)

  return countProposalsAndTotalProposalsUseCase
}
