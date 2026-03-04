import type {
  ChatSession,
  SessionRepository,
} from '../../repositories/session-repository'
import { GeminiService } from '../../lib/gemini'

interface HandleCollectingItemsUseCaseRequest {
  session: ChatSession
  phone: string
  text: string
}

export class HandleCollectingItemsUseCase {
  constructor(
    private sessionRepository: SessionRepository,
    private geminiService: GeminiService
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

      // 1. Chamar o Gemini pra extrair a lista estruturada de itens
      const extractedItems = await this.geminiService.extractBudgetItems(
        currentData,
        session.budgetType || 'product'
      )

      if (extractedItems.length === 0) {
        return '🤖 Não consegui identificar os itens da sua mensagem.\n\nTente enviar no formato:\n_Quantidade x Descrição — Valor_\n\nExemplo: _2x parafuso 5cm — R$ 0,50_'
      }

      // 2. Formatar o resumo para o usuário
      let summaryText = ''
      let totalAmount = 0

      for (const item of extractedItems) {
        summaryText += `• ${item.amount}x ${item.title}${item.price ? ` — R$ ${item.price}` : ''}\n`
        totalAmount += item.amount
      }

      // 3. Salvar os itens extraídos na sessão para o próximo passo usar
      await this.sessionRepository.saveSession(phone, {
        state: 'CONFIRMING',
        extractedItems: JSON.stringify(extractedItems),
      })

      return `📋 *Resumo do seu orçamento:*\n\n${summaryText}\nTotal de itens: *${totalAmount}*\n\nConfirmo a geração do PDF?\n\n*Sim* — Gerar PDF\n*Não* — Cancelar`
    }

    // Acumula o que a pessoa está dizendo
    const currentData = session.collectedData || ''
    await this.sessionRepository.saveSession(phone, {
      collectedData: currentData + '\n' + text,
    })

    return '✍️ Anotado! Pode continuar enviando os itens.\n\nQuando terminar, envie *1*.'
  }
}
