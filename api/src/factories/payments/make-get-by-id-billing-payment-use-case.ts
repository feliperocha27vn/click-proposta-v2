import { PrismaPaymentsRepository } from '@/repositories/prisma/payments-repository'
import { GetByIdBillingPaymentUseCase } from '@/use-cases/payments/get-by-id-billing'

export function makeGetByIdBillingPaymentUseCase() {
  const prismaPaymentsRepository = new PrismaPaymentsRepository()
  const getByIdBillingPaymentUseCase = new GetByIdBillingPaymentUseCase(
    prismaPaymentsRepository
  )
  return getByIdBillingPaymentUseCase
}
