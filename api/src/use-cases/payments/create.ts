import type { PaymentsRepository } from '@/repositories/payments-repository'

interface CreatePaymentUseCaseRequest {
  userId: string
  abacatePayId: string
}

export class CreatePaymentUseCase {
  constructor(private paymentsRepository: PaymentsRepository) {}

  async execute({ userId, abacatePayId }: CreatePaymentUseCaseRequest) {
    await this.paymentsRepository.create({
      userId,
      abacatePayId,
    })
  }
}
