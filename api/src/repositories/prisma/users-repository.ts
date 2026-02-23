import { prisma } from '@/lib/prisma'
import type { Prisma, User } from '@prisma/client'
import type { UsersRepository } from '../users-respository'

export class PrismaUsersRepository implements UsersRepository {
  async createNewCostumer(data: Prisma.CustomersUncheckedCreateInput) {
    const customer = await prisma.customers.create({
      data,
    })

    return customer
  }

  async getById(userId: string) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        plan: true,
        name: true,
        email: true,
        avatarUrl: true,
        isRegisterComplete: true,
      },
    })

    if (!user) {
      return null
    }

    return user
  }

  async fetchCustomers(userId: string) {
    const customers = await prisma.customers.findMany({
      where: {
        userId,
      },
    })

    return customers
  }

  async searchByNameAndEmail(search: string, userId: string) {
    const customers = await prisma.customers.findMany({
      where: {
        userId,
        OR: [
          {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            email: {
              contains: search,
              mode: 'insensitive',
            },
          },
        ],
      },
    })

    return customers
  }

  async countProposals(userId: string) {
    const countProposalsByUser = await prisma.proposal.count({
      where: {
        userId,
      },
    })

    return countProposalsByUser
  }

  async completeRegister(
    userId: string,
    data: Prisma.UserUpdateInput
  ): Promise<User> {
    const user = await prisma.user.update({
      where: { id: userId },
      data,
    })

    return user
  }

  async getCompleteRegister(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { isRegisterComplete: true },
    })

    if (!user) {
      return null
    }

    return user
  }

  async getDataForPayment(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        email: true,
        phone: true,
        cpf: true,
      },
    })

    if (!user) {
      return null
    }

    return {
      name: user.name,
      email: user.email,
      phone: user.phone,
      cpf: user.cpf,
    }
  }

  async changePlan(userId: string) {
    console.log('PrismaUsersRepository: Changing plan for user:', userId)

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { plan: 'PRO' },
    })

    console.log(
      'PrismaUsersRepository: Plan updated. New plan:',
      updatedUser.plan
    )
  }

  async getDataForCreatePdfProduct(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        phone: true,
        email: true,
        cnpj: true,
        avatarUrl: true,
      },
    })

    if (!user) {
      return null
    }

    return user
  }
}
