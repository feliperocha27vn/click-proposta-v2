import type { AiProvider } from '../../providers/ai/ai-provider'
import type { SessionRepository } from '../../repositories/session-repository'

interface HandleAwaitingTotalValueUseCaseRequest {
  phone: string
  text: string
}

export class HandleAwaitingTotalValueUseCase {
  constructor(
    private sessionRepository: SessionRepository,
    private aiProvider: AiProvider
  ) {}

  async execute({
    phone,
    text,
  }: HandleAwaitingTotalValueUseCaseRequest): Promise<string> {
    // Agora usamos a IA para extrair o valor de forma inteligente (ex: "20 mil reais" -> 20000)
    const totalValue = await this.aiProvider.extractTotalValue(text)

    if (totalValue === null || Number.isNaN(totalValue)) {
      return '⚠️ Não consegui entender o valor informado. Por favor, envie o valor (ex: 1500,00 ou "20 mil reais").'
    }

    // 2. Salva o valor na sessão e avança para confirmação
    await this.sessionRepository.saveSession(phone, {
      totalValue,
      state: 'CONFIRMING',
    })

    return `✅ Valor de *R$ ${totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}* anotado.\n\nConfirmo a geração do PDF do seu orçamento?\n\n*Sim* — Gerar PDF\n*Não* — Cancelar`
  }
}
