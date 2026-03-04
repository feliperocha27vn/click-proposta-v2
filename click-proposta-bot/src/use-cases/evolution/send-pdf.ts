import axios from 'axios'
import { env } from '../../env'

const evolutionApi = axios.create({
  baseURL: env.EVOLUTION_API_URL,
  headers: {
    apikey: env.EVOLUTION_API_TOKEN,
  },
})

interface SendPdfUseCaseRequest {
  instanceName: string
  phone: string
  base64Pdf: string
  fileName: string
}

export class SendPdfUseCase {
  async execute({
    instanceName,
    phone,
    base64Pdf,
    fileName,
  }: SendPdfUseCaseRequest): Promise<void> {
    try {
      await evolutionApi.post(`/message/sendMedia/${instanceName}`, {
        number: phone,
        mediatype: 'document',
        mimetype: 'application/pdf',
        caption: 'Aqui está o seu orçamento!',
        media: base64Pdf,
        fileName: fileName,
      })
    } catch (error: unknown) {
      const err = error as { response?: { data: unknown }; message: string }
      console.error(
        `[Evolution] Erro ao enviar PDF para ${phone}:`,
        err?.response?.data || err.message
      )
    }
  }
}
