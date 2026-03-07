import type { AiProvider } from '../../providers/ai/ai-provider'
import type {
  ChatSession,
  SessionRepository,
} from '../../repositories/session-repository'

interface HandleCollectingItemsUseCaseRequest {
  session: ChatSession
  phone: string
  text: string
}

export class HandleCollectingItemsUseCase {
  constructor(
    private sessionRepository: SessionRepository,
    private aiProvider: AiProvider
  ) {}

  async execute({
    session,
    phone,
    text,
  }: HandleCollectingItemsUseCaseRequest): Promise<string> {
    if (text.trim() === '1') {
      const currentData = session.collectedData || ''

      if (!currentData.trim()) {
        return '⚠️ Você ainda não enviou nenhum item.\n\nMe mande os itens antes de finalizar:\n_Exemplo: 3x tinta acrílica branca — R$ 45,00_'
      }

      // 1. Chamar a IA pra extrair a lista estruturada de itens
      const extractedItems = await this.aiProvider.extractBudgetItems(
        currentData,
        session.budgetType || 'product'
      )

      if (extractedItems.length === 0) {
        return '🤖 Não consegui identificar os itens da sua mensagem.\n\nTente enviar no formato:\n_Quantidade x Descrição — Valor_\n\nExemplo: _2x parafuso 5cm — R$ 0,50_'
      }

      // 2. Formatar o resumo para o usuário
      let summaryText = ''
      let totalAmountItems = 0
      const isCivil = session.budgetType === 'civil'

      for (const item of extractedItems) {
        const amountPrefix = isCivil ? '' : `${item.amount}x `
        summaryText += `• ${amountPrefix}${item.title}${item.price ? ` — R$ ${item.price}` : ''}\n`
        totalAmountItems += item.amount
      }

      // 3. Salvar os itens extraídos na sessão
      const nextState = isCivil ? 'AWAITING_TOTAL_VALUE' : 'CONFIRMING'

      await this.sessionRepository.saveSession(phone, {
        state: nextState,
        extractedItems: JSON.stringify(extractedItems),
      })

      if (isCivil) {
        return `📋 *Resumo dos itens:*\n\n${summaryText}\n💰 Qual o *valor total* deste serviço?`
      }

      return `📋 *Resumo do seu orçamento:*\n\n${summaryText}\nTotal de itens: *${totalAmountItems}*\n\nConfirmo a geração do PDF?\n\n*Sim* — Gerar PDF\n*Não* — Cancelar`
    }

    // Acumula o que a pessoa está dizendo
    const currentData = session.collectedData || ''
    await this.sessionRepository.saveSession(phone, {
      collectedData: currentData + '\n' + text,
    })

    return '✍️ Anotado! Pode continuar enviando os itens.\n\nQuando terminar, envie *1*.'
  }
}
