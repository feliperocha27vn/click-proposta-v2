import { prisma } from '@/lib/prisma'
import type { CustomerRepository } from '../customer-repository'

export class PrismaCustomerRepository implements CustomerRepository {
  async getById(customerId: string) {
    const customer = await prisma.customers.findUnique({
      where: { id: customerId },
    })
    return customer
  }
}
