import { env } from '../env'
import { api } from '../lib/axios'
import type {
  ChatSession,
  SessionRepository,
} from '../repositories/session-repository'
import { EvolutionService } from './evolution-service'
import { GeminiService } from './gemini-service'

export class StateMachineService {
  private geminiService: GeminiService
  private evolutionService: EvolutionService

  constructor(private sessionRepository: SessionRepository) {
    this.geminiService = new GeminiService()
    this.evolutionService = new EvolutionService()
  }

  async processIncomingMessage(
    instanceName: string,
    phone: string,
    text: string
  ) {
    // 1. Traz a sessão do usuário do Redis
    const session = await this.sessionRepository.getSession(phone)

    // 2. Se não tem sessão ativa, é usuário novo iniciando a conversa
    if (!session) {
      return this.handleNewUser(phone)
    }

    // 3. O switch/case é o coração da máquina de estados
    switch (session.state) {
      case 'AWAITING_TYPE':
        return this.handleAwaitingType(phone, text)

      case 'COLLECTING_ITEMS':
        return this.handleCollectingItems(session, phone, text)

      case 'CONFIRMING':
        return this.handleConfirming(instanceName, session, phone, text)

      default:
        // Se o estado for inválido ou deu erro, reseta a sessão por segurança
        await this.sessionRepository.clearSession(phone)
        return '🔄 Tivemos um problema técnico. Por favor, reinicie a conversa mandando um "Oi".'
    }
  }

  // --- MÉTODOS PRIVADOS PARA CADA ESTADO ---

  private async handleNewUser(phone: string) {
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
        userId: user.id, // Vamos precisar disso para gerar o PDF depois
      })

      return `👋 Olá, ${
        user.name || 'cliente'
      }! Voltamos a falar. Por favor, me diga: O orçamento que você quer enviar agora é de *Produtos* ou de *Serviço Civil*?`
    } catch (error: any) {
      if (error.response?.status === 404) {
        return '😞 Poxa, não encontrei seu número cadastrado no Click Proposta. Por favor, acesse nosso site e faça o seu cadastro primeiro https://click-proposta.umdoce.dev.br/login!'
      }

      console.error('[StateMachine] Erro ao verificar usuário:', error.message)
      return '🔄 Tivemos um problema técnico ao verificar seu cadastro. Por favor, tente novamente mais tarde dizendo "Oi".'
    }
  }

  private async handleAwaitingType(phone: string, text: string) {
    const isProduct = text.toLowerCase().includes('produto')
    const isCivil =
      text.toLowerCase().includes('serviço') ||
      text.toLowerCase().includes('civil')

    if (!isProduct && !isCivil) {
      return '🤔 Desculpe, não entendi. Por favor responda com "Produto" ou "Serviço Civil".'
    }

    const budgetType = isProduct ? 'product' : 'civil'

    await this.sessionRepository.saveSession(phone, {
      state: 'COLLECTING_ITEMS',
      budgetType,
    })

    return '✅ Entendido! Agora me mande os itens do orçamento (pode digitar tudo ou mandar um áudio).\n\nQuando terminar, digite *CONCLUÍDO*.'
  }

  private async handleCollectingItems(
    session: ChatSession,
    phone: string,
    text: string
  ) {
    if (
      text.toLowerCase() === 'concluído' ||
      text.toLowerCase() === 'concluido'
    ) {
      const currentData = session.collectedData || ''

      if (!currentData.trim()) {
        return '🤔 Você ainda não enviou nenhum item. Por favor, me mande os itens do seu orçamento antes de digitar CONCLUÍDO.'
      }

      // 1. Chamar o Gemini pra extrair a lista estruturada de itens
      const extractedItems = await this.geminiService.extractBudgetItems(
        currentData,
        session.budgetType || 'product'
      )

      if (extractedItems.length === 0) {
        return '😟 Desculpe, não consegui entender nenhum item na sua mensagem. Pode tentar enviar novamente com mais clareza?'
      }

      // 2. Formatar o resumo para o usuário
      let summaryText = ''
      let totalAmount = 0

      for (const item of extractedItems) {
        summaryText += `- ${item.amount}x ${item.title} ${
          item.price ? '(R$ ' + item.price + ')' : ''
        }\n`
        totalAmount += item.amount
      }

      // 3. Salvar os itens extraídos na sessão para o próximo passo usar
      await this.sessionRepository.saveSession(phone, {
        state: 'CONFIRMING',
        // Podemos salvar como JSON string no Redis
        extractedItems: JSON.stringify(extractedItems),
      })

      return `⏳ Perfeito! Analisei seus itens e este é o resumo do orçamento:\n\n${summaryText}\nTotal de itens: ${totalAmount}\n\nPosso gerar o PDF agora? (Sim/Não)`
    }

    // Acumula o que a pessoa está dizendo
    const currentData = session.collectedData || ''
    await this.sessionRepository.saveSession(phone, {
      collectedData: currentData + '\n' + text,
    })

    return '👉 Item adicionado. Mande mais itens ou digite *CONCLUÍDO* para gerar o orçamento.'
  }

  private async handleConfirming(
    instanceName: string,
    session: ChatSession,
    phone: string,
    text: string
  ) {
    if (text.toLowerCase() === 'sim') {
      try {
        // Envia mensagem avisando que está gerando, não dependura essa em return (não block o webhook loop da Evolution)
        await this.evolutionService.sendText(
          instanceName,
          phone,
          '📄 Gerando seu PDF, aguarde um instante...'
        )

        if (!session.extractedItems || !session.userId) {
          await this.sessionRepository.clearSession(phone)
          return '❌ Erro interno: Dados do orçamento foram perdidos. Por favor, reinicie dizendo "Oi".'
        }

        const items = JSON.parse(session.extractedItems)
        const budgetType = session.budgetType || 'product'

        // Calcula o valor total do orçamento informando 0 se a Gemini não achou preço
        const totalValue = items.reduce(
          (acc: number, item: any) =>
            acc + (item.price || 0) * (item.amount || 1),
          0
        )

        // Mapeia os itens da Gemini para o formato exato que a API espera (services)
        const mappedServices = items.map((item: any) => ({
          title: item.title,
          description: '',
          quantity: item.amount || 1,
          price: item.price || 0,
        }))

        // Define qual rota na API principal será chamada baseada no budgetType
        const endpoint =
          budgetType === 'product' ? '/pdf/generate-product' : '/pdf/generate'

        // AQUI ENTRA: Chamada para a API v2
        const response = await api.post(
          endpoint,
          {
            userId: session.userId,
            total: String(totalValue),
            services: mappedServices,
          },
          {
            headers: {
              Authorization: `Bearer ${env.BOT_SERVICE_TOKEN}`, // Nossa autenticação interna
            },
            responseType: 'arraybuffer', // Precisamos do arquivo para converter em base64
          }
        )

        // Converter buffer PDF para base64 para a Evolution API
        const base64Pdf = Buffer.from(response.data, 'binary').toString(
          'base64'
        )
        const fileName = `orcamento-${budgetType}-${Date.now()}.pdf`

        // Envia o PDF pronto de volta usando o web hook da Evolution Api
        await this.evolutionService.sendPdf(
          instanceName,
          phone,
          base64Pdf,
          fileName
        )

        // Limpa a sessão
        await this.sessionRepository.clearSession(phone)

        // Opcional devolver um texto vazio ou nulo já que o service de send já mandou a resposta
        return null
      } catch (error: any) {
        console.error('[StateMachine] Erro ao gerar PDF:', error.message)
        await this.sessionRepository.clearSession(phone)
        return '❌ Infelizmente ocorreu um erro técnico na geração do seu PDF no nosso sistema. O Orçamento foi cancelado, tente mandar um "Oi" para recomeçar.'
      }
    } else {
      await this.sessionRepository.clearSession(phone)
      return '❌ Orçamento cancelado. Você pode começar um novo a qualquer momento dizendo "Oi".'
    }
  }
}
