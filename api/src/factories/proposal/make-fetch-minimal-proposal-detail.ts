import { PrismaProposalRepository } from '@/repositories/prisma/proposal-repository'
import { FetchProposalMinimalDetailsUseCase } from '@/use-cases/proposal/fetch-minimal-details'

export function makeFetchMinimalProposalDetail() {
  const prismaProposalRepository = new PrismaProposalRepository()
  const fetchMinimalProposalDetailUseCase =
    new FetchProposalMinimalDetailsUseCase(prismaProposalRepository)

  return fetchMinimalProposalDetailUseCase
}
