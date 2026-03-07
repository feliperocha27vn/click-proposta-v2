import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { makeProcessIncomingMessageUseCase } from '../../../factories/make-process-incoming-message-use-case'
import { redis } from '../../../lib/redis'
import { GeminiAiProvider } from '../../../providers/ai/gemini-ai-provider'
import { EvolutionMessagingProvider } from '../../../providers/messaging/messaging-provider'

const aiProvider = new GeminiAiProvider()
const messagingProvider = new EvolutionMessagingProvider()

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
            id: z.string().optional(), // ID da mensagem, necessário para baixar mídia
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
      const remoteJid = body.data.key.remoteJid
      const messageId = body.data.key.id

      // 1.1 Filtragem de JID: Ignora se for grupo (@g.us) ou broadcast (@broadcast)
      if (
        !remoteJid.endsWith('@s.whatsapp.net') &&
        !remoteJid.endsWith('@c.us')
      ) {
        return reply.status(200).send()
      }

      // 1.2 Idempotência: Evita processar a mesma mensagem mais de uma vez (webhook duplicado)
      if (messageId) {
        const lockKey = `msg:processed:${messageId}`
        const isProcessed = await redis.get(lockKey)

        if (isProcessed) {
          return reply.status(200).send()
        }

        // Marca como processada por 1 minuto (tempo suficiente para evitar duplicatas da Evolution)
        await redis.set(lockKey, 'true', 'EX', 60)
      }

      const phone = remoteJid.split('@')[0].split(':')[0]

      // Extrai o texto da mensagem (A Evolution API envia em vários formatos dependendo se é texto puro, resposta, etc)
      const messageData = body.data.message
      let text = ''

      if (messageData) {
        if (messageData.conversation) {
          text = messageData.conversation
        } else if (messageData.extendedTextMessage?.text) {
          text = messageData.extendedTextMessage.text
        } else if (messageData.audioMessage) {
          // Extrai áudio
          const messageId = body.data.key.id
          if (messageId) {
            console.log(`[Webhook] Baixando áudio da mensagem ${messageId}...`)
            const media = await messagingProvider.getBase64Media({
              instanceName,
              messageId,
              remoteJid: body.data.key.remoteJid,
              fromMe: body.data.key.fromMe,
            })

            if (media) {
              console.log('[Webhook] Áudio baixado, iniciando transcrição...')
              text = await aiProvider.transcribeAudio(
                media.base64,
                media.mimetype
              )
            }
          }
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

      // 2. Chama a Máquina de Estados (Use Case Orquestrador) e espera a resposta
      const processIncomingMessageUseCase = makeProcessIncomingMessageUseCase()
      const botResponse = await processIncomingMessageUseCase.execute({
        instanceName,
        phone,
        text,
      })

      if (botResponse) {
        console.log(`[Bot] Resposta para ${phone}: ${botResponse}`)
        await messagingProvider.sendText({
          instanceName,
          phone,
          text: botResponse,
        })
      }

      return reply.status(200).send()
    } catch (error) {
      console.error('[Webhook] Erro processando hook:', error)
      // Sempre retornamos 200 pra Evolution API não ficar tentando reenviar o tempo todo em caso de erro interno nosso
      return reply.status(200).send()
    }
  })
}
