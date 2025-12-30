import { PrismaProposalRepository } from '@/repositories/prisma/proposal-repository'
import { PrismaUsersRepository } from '@/repositories/prisma/users-repository'
import { CreateProposalUseCase } from '@/use-cases/proposal/create'

export function makeCreateProposalUseCase() {
  const prismaProposalRepository = new PrismaProposalRepository()
  const prismaUsersRepository = new PrismaUsersRepository()
  const createProposalUseCase = new CreateProposalUseCase(
    prismaProposalRepository,
    prismaUsersRepository
  )

  return createProposalUseCase
}
