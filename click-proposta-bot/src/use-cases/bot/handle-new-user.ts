import { env } from '../../env'
import { api } from '../../lib/axios'
import type { SessionRepository } from '../../repositories/session-repository'

interface HandleNewUserUseCaseRequest {
  phone: string
}

export class HandleNewUserUseCase {
  constructor(private sessionRepository: SessionRepository) {}

  async execute({ phone }: HandleNewUserUseCaseRequest): Promise<string> {
    try {
      // Remove o código do país (55) se o número for brasileiro para achar no banco
      let apiPhone = phone
      if (apiPhone.startsWith('55') && apiPhone.length === 13) {
        apiPhone = apiPhone.substring(2)
      }

      // Bate na API v2 para ver se o telefone existe
      const response = await api.get('/verify-phone', {
        headers: { Authorization: `Bearer ${env.BOT_SERVICE_TOKEN}` },
        params: { phone: apiPhone },
      })

      const user = response.data.user

      // Se existir, salva novo estado, pedindo o tipo de orçamento e guarda o ID do usuário
      await this.sessionRepository.saveSession(phone, {
        phone,
        state: 'AWAITING_TYPE',
        userId: user.id,
      })

      return `👋 Olá, *${user.name || 'cliente'}*! Que bom ter você aqui.\n\nPara começar, qual o tipo do seu orçamento?\n\n*1* — Produtos\n*2* — Serviço Civil\n\nResponda com *1* ou *2*.`
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { status: number }
        message: string
      }
      if (axiosError.response?.status === 404) {
        return '😕 Hmm, não encontrei seu número no *Click Proposta*.\n\nPara usar o bot, você precisa ter uma conta ativa. Crie a sua em:\n👉 https://click-proposta.umdoce.dev.br/login'
      }

      console.error(
        '[UseCase: HandleNewUser] Erro ao verificar usuário:',
        axiosError.message
      )
      return '⚠️ Algo deu errado no nosso lado, desculpe o transtorno.\n\nTente novamente em instantes enviando um *Oi*.'
    }
  }
}
