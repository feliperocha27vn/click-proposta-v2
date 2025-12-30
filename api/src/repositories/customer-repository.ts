import type { Customers } from '@prisma/client'

export interface CustomerRepository {
  getById(customerId: string): Promise<Customers | null>
}
