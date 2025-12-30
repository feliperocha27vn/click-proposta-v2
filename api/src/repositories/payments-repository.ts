import type { Payments, Prisma } from '@prisma/client'

export interface PaymentsRepository {
  create(data: Prisma.PaymentsUncheckedCreateInput): Promise<Payments>
  getByIdBilling(billingId: string): Promise<Payments | null>
}
