import { PrismaPaymentsRepository } from '@/repositories/prisma/payments-repository'
import { CreatePaymentUseCase } from '@/use-cases/payments/create'

export function makeCreatePaymentUseCase() {
  const prismaPaymentsRepository = new PrismaPaymentsRepository()
  const createPaymentUseCase = new CreatePaymentUseCase(
    prismaPaymentsRepository
  )
  return createPaymentUseCase
}
