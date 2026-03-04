import axios from 'axios'
import { env } from '../../env'

const evolutionApi = axios.create({
  baseURL: env.EVOLUTION_API_URL,
  headers: {
    apikey: env.EVOLUTION_API_TOKEN,
  },
})

interface SendTextUseCaseRequest {
  instanceName: string
  phone: string
  text: string
}

export class SendTextUseCase {
  async execute({
    instanceName,
    phone,
    text,
  }: SendTextUseCaseRequest): Promise<void> {
    try {
      await evolutionApi.post(`/message/sendText/${instanceName}`, {
        number: phone,
        text: text,
      })
    } catch (error: unknown) {
      const err = error as { response?: { data: unknown }; message: string }
      console.error(
        `[Evolution] Erro ao enviar mensagem para ${phone}:`,
        err?.response?.data || err.message
      )
    }
  }
}
