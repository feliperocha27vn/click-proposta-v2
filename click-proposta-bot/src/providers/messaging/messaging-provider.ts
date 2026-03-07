import axios from 'axios'
import { env } from '../../env'
export interface SendTextParams {
  instanceName: string
  phone: string
  text: string
}

export interface SendPdfParams {
  instanceName: string
  phone: string
  base64Pdf: string
  fileName: string
}

export interface GetBase64MediaParams {
  instanceName: string
  messageId: string
  remoteJid: string
  fromMe: boolean
}

export interface Base64MediaResponse {
  base64: string
  mimetype: string
}

export interface MessagingProvider {
  sendText(params: SendTextParams): Promise<void>
  sendPdf(params: SendPdfParams): Promise<void>
  getBase64Media(
    params: GetBase64MediaParams
  ): Promise<Base64MediaResponse | null>
}

const evolutionApi = axios.create({
  baseURL: env.EVOLUTION_API_URL,
  headers: {
    apikey: env.EVOLUTION_API_TOKEN,
  },
})

export class EvolutionMessagingProvider implements MessagingProvider {
  async sendText({ instanceName, phone, text }: SendTextParams): Promise<void> {
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

  async sendPdf({
    instanceName,
    phone,
    base64Pdf,
    fileName,
  }: SendPdfParams): Promise<void> {
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

  async getBase64Media({
    instanceName,
    messageId,
    remoteJid,
    fromMe,
  }: GetBase64MediaParams): Promise<Base64MediaResponse | null> {
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
