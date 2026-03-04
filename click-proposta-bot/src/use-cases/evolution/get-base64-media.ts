import axios from 'axios'
import { env } from '../../env'

const evolutionApi = axios.create({
  baseURL: env.EVOLUTION_API_URL,
  headers: {
    apikey: env.EVOLUTION_API_TOKEN,
  },
})

interface GetBase64MediaUseCaseRequest {
  instanceName: string
  messageId: string
  remoteJid: string
  fromMe: boolean
}

export interface Base64MediaResponse {
  base64: string
  mimetype: string
}

export class GetBase64MediaUseCase {
  async execute({
    instanceName,
    messageId,
    remoteJid,
    fromMe,
  }: GetBase64MediaUseCaseRequest): Promise<Base64MediaResponse | null> {
    try {
      const response = await evolutionApi.post(
        `/chat/getBase64FromMediaMessage/${instanceName}`,
        {
          message: {
            key: {
              id: messageId,
              remoteJid: remoteJid,
              fromMe: fromMe,
            },
          },
        }
      )
      return {
        base64: response.data.base64,
        mimetype: response.data.mimetype,
      }
    } catch (error: unknown) {
      const err = error as { response?: { data: unknown }; message: string }
      console.error(
        `[Evolution] Erro ao baixar mídia da mensagem ${messageId}:`,
        err?.response?.data || err.message
      )
      return null
    }
  }
}
