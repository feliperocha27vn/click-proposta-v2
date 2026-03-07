import type { SessionRepository } from '../../repositories/session-repository'

interface HandleAwaitingTypeUseCaseRequest {
  phone: string
  text: string
}

export class HandleAwaitingTypeUseCase {
  constructor(private sessionRepository: SessionRepository) {}

  async execute({
    phone,
    text,
  }: HandleAwaitingTypeUseCaseRequest): Promise<string> {
    const isProduct =
      text.trim() === '1' || text.toLowerCase().includes('produto')
    const isCivil =
      text.trim() === '2' ||
      text.toLowerCase().includes('serviço') ||
      text.toLowerCase().includes('civil')

    if (!isProduct && !isCivil) {
      return '🤔 Não entendi sua resposta. Por favor, escolha uma das opções:\n\n*1* — Produtos\n*2* — Serviço Civil'
    }

    const budgetType = isProduct ? 'product' : 'civil'

    if (isProduct) {
      await this.sessionRepository.saveSession(phone, {
        state: 'COLLECTING_ITEMS',
        budgetType,
      })
      return '✅ Ótimo! Agora me mande os itens do orçamento.\n\nPode digitar assim:\n_2x Parafuso phillips 5cm — R$ 0,50_\n_1x Cimento 50kg — R$ 35,00_\n\nOu envie um áudio com os itens.\n\nQuando terminar, envie *1*.'
    }

    // isCivil
    await this.sessionRepository.saveSession(phone, {
      state: 'AWAITING_CUSTOMER_NAME',
      budgetType,
    })
    return 'Certo! Para começarmos, qual é o nome do cliente?'
  }
}
