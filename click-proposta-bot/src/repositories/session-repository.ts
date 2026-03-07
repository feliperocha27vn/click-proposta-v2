import { redis } from '../lib/redis'

export interface ChatSession {
  phone: string
  state:
    | 'NEW'
    | 'AWAITING_TYPE' // Esperando dizer se é produto ou serviço
    | 'AWAITING_CUSTOMER_NAME' // Esperando o nome do cliente (apenas para serviço)
    | 'AWAITING_TOTAL_VALUE' // Esperando o valor total (apenas para serviço)
    | 'COLLECTING_ITEMS' // Coletando os itens do orçamento via texto/áudio
    | 'CONFIRMING' // Confirmando se pode gerar o PDF
  budgetType?: 'product' | 'civil'
  collectedData?: string
  extractedItems?: string
  userId?: string
  customerName?: string
  totalValue?: number
}

// 15 minutos de inatividade expira a sessão (limpa da memória)
const EXPIRATION_IN_SECONDS = 60 * 15

export class SessionRepository {
  async getSession(phone: string): Promise<ChatSession | null> {
    const data = await redis.hgetall(`session:${phone}`)

    if (Object.keys(data).length === 0) {
      return null
    }

    return data as unknown as ChatSession
  }

  async saveSession(
    phone: string,
    session: Partial<ChatSession>
  ): Promise<void> {
    const key = `session:${phone}`

    // Salva os campos no hash do Redis
    await redis.hset(key, session)
    // Renova o tempo de expiração
    await redis.expire(key, EXPIRATION_IN_SECONDS)
  }

  async clearSession(phone: string): Promise<void> {
    await redis.del(`session:${phone}`)
  }
}
