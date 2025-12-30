import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import type { PaymentsRepository } from '@/repositories/payments-repository'
import type { Payments } from '@prisma/client'

interface GetByIdBillingPaymentUseCaseRequest {
  billingId: string
}

interface GetByIdBillingPaymentUseCaseReply {
  payment: Payments
}

export class GetByIdBillingPaymentUseCase {
  constructor(private paymentsRepository: PaymentsRepository) {}

  async execute({
    billingId,
  }: GetByIdBillingPaymentUseCaseRequest): Promise<GetByIdBillingPaymentUseCaseReply> {
    const payment = await this.paymentsRepository.getByIdBilling(billingId)

    if (!payment) {
      throw new ResourceNotFoundError()
    }

    return { payment }
  }
}
