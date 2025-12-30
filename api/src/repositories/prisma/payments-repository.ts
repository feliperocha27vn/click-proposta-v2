import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'
import type { PaymentsRepository } from '../payments-repository'

export class PrismaPaymentsRepository implements PaymentsRepository {
  async create(data: Prisma.PaymentsUncheckedCreateInput) {
    const payment = await prisma.payments.create({
      data,
    })

    return payment
  }

  async getByIdBilling(billingId: string) {
    const payment = await prisma.payments.findUnique({
      where: {
        abacatePayId: billingId,
      },
    })

    return payment
  }
}
