import { PrismaCustomerRepository } from '@/repositories/prisma/customer-repository'
import { PrismaProposalDraftRepository } from '@/repositories/prisma/proposal-draft-repository'
import { PrismaUsersRepository } from '@/repositories/prisma/users-repository'
import { CreateProposalDraftUseCase } from '@/use-cases/proposal-draft/create-proposal-draft'

export function makeCreateProposalDraftUseCase() {
  const prismaProposalDraftRepository = new PrismaProposalDraftRepository()
  const prismaUsersRepository = new PrismaUsersRepository()
  const prismaCustomersRepository = new PrismaCustomerRepository()
  const createProposalDraftUseCase = new CreateProposalDraftUseCase(
    prismaProposalDraftRepository,
    prismaUsersRepository,
    prismaCustomersRepository
  )

  return createProposalDraftUseCase
}
