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
        planType: true,
        planExpiresAt: true,
        name: true,
        email: true,
        avatarUrl: true,
        isRegisterComplete: true,
        cnpj: true,
        address: true,
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

  async countProposalsInMonth(userId: string) {
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const count = await prisma.proposalLog.count({
      where: {
        userId,
        createdAt: {
          gte: startOfMonth,
        },
      },
    })

    return count
  }

  async createProposalLog(
    userId: string,
    origin: 'BOT' | 'SITE',
    type: 'PROPOSAL' | 'BUDGET'
  ) {
    await prisma.proposalLog.create({
      data: {
        userId,
        origin,
        type,
      },
    })
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
      select: { 
        isRegisterComplete: true,
        cpf: true,
        phone: true,
        address: true
      },
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

    const now = new Date()
    const expiresAt = new Date(now)
    expiresAt.setDate(now.getDate() + 30)

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        plan: 'PRO',
        planType: 'PRO',
        planExpiresAt: expiresAt,
      },
    })

    console.log(
      'PrismaUsersRepository: Plan updated. New plan:',
      updatedUser.plan,
      'Expires at:',
      updatedUser.planExpiresAt
    )
  }

  async getDataForCreatePdfProduct(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        phone: true,
        name: true,
        email: true,
        cnpj: true,
        avatarUrl: true,
        address: true,
      },
    })

    if (!user) {
      return null
    }

    return user
  }

  async getUserByPhone(phone: string) {
    const user = await prisma.user.findFirst({
      where: { phone },
    })

    if (!user) {
      return null
    }

    return user
  }
}
