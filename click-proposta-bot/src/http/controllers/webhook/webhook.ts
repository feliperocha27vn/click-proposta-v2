import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { SessionRepository } from '../../../repositories/session-repository'
import { EvolutionService } from '../../../services/evolution-service'
import { StateMachineService } from '../../../services/state-machine-service'

const sessionRepository = new SessionRepository()
const stateMachineService = new StateMachineService(sessionRepository)
const evolutionService = new EvolutionService()

export async function webhookRoutes(app: FastifyInstance) {
  app.post('/webhook', async (request, reply) => {
    // 1. Validação básica do formato do Webhook da Evolution API
    // Usamos .loose() porque a Evolution manda muitos outros campos que não precisamos agora.
    const webhookSchema = z
      .object({
        event: z.string(),
        instance: z.string(), // O none da instância vem no webhook!
        data: z.object({
          key: z.object({
            remoteJid: z.string(), // O número de telefone de quem enviou
            fromMe: z.boolean(), // Se foi o próprio bot quem enviou
          }),
          message: z.any().optional(), // O conteúdo da mensagem (texto, áudio, etc)
          pushName: z.string().optional(), // Nome do usuário no WhatsApp
        }),
      })
      .loose()

    try {
      const body = webhookSchema.parse(request.body)

      // Ignora mensagens enviadas pelo próprio bot, ou eventos que não sejam mensagens
      if (body.event !== 'messages.upsert' || body.data.key.fromMe) {
        return reply.status(200).send()
      }

      const instanceName = body.instance
      const phone = body.data.key.remoteJid.replace('@s.whatsapp.net', '')

      // Extrai o texto da mensagem (A Evolution API envia em vários formatos dependendo se é texto puro, resposta, etc)
      const messageData = body.data.message
      let text = ''

      if (messageData) {
        if (messageData.conversation) {
          text = messageData.conversation
        } else if (messageData.extendedTextMessage?.text) {
          text = messageData.extendedTextMessage.text
        }
      }

      // Se não for uma mensagem de texto (ex: imagem, figurinha, áudio), por enquanto ignora
      if (!text) {
        console.log(`[Webhook] Mensagem não suportada recebida de ${phone}`)
        return reply.status(200).send()
      }

      console.log(
        `[Webhook] Mensagem recebida de ${phone} [${instanceName}]: ${text}`
      )

      // 2. Chama a Máquina de Estados e espera a resposta
      const botResponse = await stateMachineService.processIncomingMessage(
        instanceName,
        phone,
        text
      )

      if (botResponse) {
        console.log(`[Bot] Resposta para ${phone}: ${botResponse}`)
        await evolutionService.sendText(instanceName, phone, botResponse)
      }

      return reply.status(200).send()
    } catch (error) {
      console.error('[Webhook] Erro processando hook:', error)
      // Sempre retornamos 200 pra Evolution API não ficar tentando reenviar o tempo todo em caso de erro interno nosso
      return reply.status(200).send()
    }
  })
}
