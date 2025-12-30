import { PrismaCustomerRepository } from '@/repositories/prisma/customer-repository'
import { PrismaProposalDraftRepository } from '@/repositories/prisma/proposal-draft-repository'
import { PrismaUsersRepository } from '@/repositories/prisma/users-repository'
import { GetLastDraftProposal } from '@/use-cases/proposal-draft/get-last-draft-proposal'

export function makeGetLastDraftProposal() {
  const prismaProposalDraftRepository = new PrismaProposalDraftRepository()
  const prismaUsersRepository = new PrismaUsersRepository()
  const prismaCustomerRepository = new PrismaCustomerRepository()
  const getLastDraftProposalUseCase = new GetLastDraftProposal(
    prismaProposalDraftRepository,
    prismaUsersRepository,
    prismaCustomerRepository
  )

  return getLastDraftProposalUseCase
}
