import { env } from '../../env'
import { api } from '../../lib/axios'
import type { MessagingProvider } from '../../providers/messaging/messaging-provider'
import type {
  ChatSession,
  SessionRepository,
} from '../../repositories/session-repository'

interface HandleConfirmingUseCaseRequest {
  instanceName: string
  session: ChatSession
  phone: string
  text: string
}

export class HandleConfirmingUseCase {
  constructor(
    private sessionRepository: SessionRepository,
    private messagingProvider: MessagingProvider
  ) {}

  async execute({
    instanceName,
    session,
    phone,
    text,
  }: HandleConfirmingUseCaseRequest): Promise<string | null> {
    if (text.toLowerCase() === 'sim') {
      try {
        await this.messagingProvider.sendText({
          instanceName,
          phone,
          text: '⏳ Gerando seu orçamento em PDF... Aguarde só um instante!',
        })

        if (!session.extractedItems || !session.userId) {
          await this.sessionRepository.clearSession(phone)
          return '❌ Ops! Os dados do seu orçamento foram perdidos.\n\nPor favor, envie *Oi* para começar novamente.'
        }

        const items = JSON.parse(session.extractedItems)
        const budgetType = session.budgetType || 'product'

        interface BudgetItem {
          title: string
          amount: number
          price: number
        }

        // Calcula o valor total do orçamento informando 0 se a Gemini não achou preço
        const totalValue = items.reduce(
          (acc: number, item: BudgetItem) =>
            acc + (item.price || 0) * (item.amount || 1),
          0
        )

        // Mapeia os itens da Gemini para o formato exato que a API espera (services)
        const mappedServices = items.map((item: BudgetItem) => ({
          title: item.title,
          description: '',
          quantity: item.amount || 1,
          price: item.price || 0,
        }))

        const endpoint =
          budgetType === 'product' ? '/pdf/generate-product' : '/pdf/generate'

        const response = await api.post(
          endpoint,
          {
            userId: session.userId,
            total: String(totalValue),
            services: mappedServices,
          },
          {
            headers: {
              Authorization: `Bearer ${env.BOT_SERVICE_TOKEN}`,
            },
            responseType: 'arraybuffer',
          }
        )

        const base64Pdf = Buffer.from(response.data, 'binary').toString(
          'base64'
        )
        const fileName = `orcamento-${budgetType}-${Date.now()}.pdf`

        await this.messagingProvider.sendPdf({
          instanceName,
          phone,
          base64Pdf,
          fileName,
        })

        await this.sessionRepository.clearSession(phone)

        return null
      } catch (error: unknown) {
        const err = error as { message: string }
        console.error(
          '[UseCase: HandleConfirming] Erro ao gerar PDF:',
          err.message
        )
        await this.sessionRepository.clearSession(phone)
        return '❌ Não conseguimos gerar o PDF desta vez.\n\nPor favor, tente novamente enviando *Oi*. Se o erro persistir, entre em contato com o suporte.'
      }
    } else {
      await this.sessionRepository.clearSession(phone)
      return '👍 Orçamento cancelado.\n\nQuando quiser criar um novo, é só enviar *Oi*.'
    }
  }
}
