import axios from 'axios'
import { env } from '../env'

// Cliente Axios exclusivo para falar com a Evolution API
const evolutionApi = axios.create({
  baseURL: env.EVOLUTION_API_URL,
  headers: {
    apikey: env.EVOLUTION_API_TOKEN,
  },
})

export class EvolutionService {
  /**
   * Envia uma mensagem de texto simples
   */
  async sendText(instanceName: string, phone: string, text: string) {
    try {
      await evolutionApi.post(`/message/sendText/${instanceName}`, {
        number: phone,
        text: text,
      })
    } catch (error: any) {
      console.error(
        `[Evolution] Erro ao enviar mensagem para ${phone}:`,
        error?.response?.data || error.message
      )
    }
  }

  /**
   * Envia um arquivo PDF gerado em base64
   */
  async sendPdf(
    instanceName: string,
    phone: string,
    base64Pdf: string,
    fileName: string
  ) {
    try {
      await evolutionApi.post(`/message/sendMedia/${instanceName}`, {
        number: phone,
        mediatype: 'document',
        mimetype: 'application/pdf',
        caption: 'Aqui está o seu orçamento!', // Mensagem que acompanha o arquivo
        media: base64Pdf,
        fileName: fileName,
      })
    } catch (error: any) {
      console.error(
        `[Evolution] Erro ao enviar PDF para ${phone}:`,
        error?.response?.data || error.message
      )
    }
  }
}
