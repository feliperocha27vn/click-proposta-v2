/**
 * Testes de integração do Webhook
 *
 * Usa Supertest sobre a instância real do Fastify (app.ts).
 * Todos os serviços externos são mockados no nível de módulo.
 */

import request from 'supertest'
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'
import { mockApi, mockApiGet } from '../mocks/axios.mock'
import {
  MockEvolutionMessagingProvider,
  mockGetBase64Media,
  mockSendText,
} from '../mocks/evolution.mock'
import { MockGeminiAiProvider, mockTranscribeAudio } from '../mocks/gemini.mock'
import { mockRedis } from '../mocks/redis.mock'

vi.mock('../../lib/redis', () => ({ redis: mockRedis }))
vi.mock('../../lib/axios', () => ({ api: mockApi }))
vi.mock('../../providers/messaging/evolution-messaging-provider', () => ({
  EvolutionMessagingProvider: MockEvolutionMessagingProvider,
}))
vi.mock('../../providers/ai/gemini-ai-provider', () => ({
  GeminiAiProvider: MockGeminiAiProvider,
}))

import { app } from '../../app'

// Payload base que a Evolution API envia
function buildWebhookPayload(overrides: Record<string, unknown> = {}) {
  return {
    event: 'messages.upsert',
    instance: 'minha-instancia',
    data: {
      key: {
        remoteJid: '5511999999999@s.whatsapp.net',
        fromMe: false,
      },
      message: {
        conversation: 'Oi',
      },
      pushName: 'Felipe',
    },
    ...overrides,
  }
}

// ---------------------------------------------------------------------------
describe('POST /webhook', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    vi.clearAllMocks()
    mockRedis.flush()
  })

  // =========================================================================
  describe('filtragem e ignorar mensagens', () => {
    it('deve responder 200 e ignorar eventos que não sejam messages.upsert', async () => {
      const response = await request(app.server)
        .post('/webhook')
        .send(buildWebhookPayload({ event: 'connection.update' }))

      expect(response.status).toBe(200)
      expect(mockApiGet).not.toHaveBeenCalled()
    })

    it('deve responder 200 e ignorar mensagens enviadas pelo próprio bot (fromMe: true)', async () => {
      const response = await request(app.server)
        .post('/webhook')
        .send(
          buildWebhookPayload({
            data: {
              key: { remoteJid: '5511999999999@s.whatsapp.net', fromMe: true },
              message: { conversation: 'Qualquer texto' },
            },
          })
        )

      expect(response.status).toBe(200)
      expect(mockApiGet).not.toHaveBeenCalled()
    })

    it('deve responder 200 e ignorar mensagens sem texto (ex: imagem, sticker)', async () => {
      const response = await request(app.server)
        .post('/webhook')
        .send(
          buildWebhookPayload({
            data: {
              key: { remoteJid: '5511999999999@s.whatsapp.net', fromMe: false },
              message: { imageMessage: { url: 'https://example.com/img.jpg' } },
            },
          })
        )

      expect(response.status).toBe(200)
      expect(mockApiGet).not.toHaveBeenCalled()
    })

    it('deve responder 200 mesmo se o body for inválido (Zod parse error)', async () => {
      const response = await request(app.server)
        .post('/webhook')
        .send({ campo_invalido: true })

      // A Evolution API não pode receber 500, o webhook sempre responde 200
      expect(response.status).toBe(200)
    })
  })

  // =========================================================================
  describe('extração do texto da mensagem', () => {
    it('deve processar texto via extendedTextMessage (formato alternativo)', async () => {
      mockApiGet.mockResolvedValueOnce({
        data: { user: { id: 'user-ext', name: 'User Ext' } },
      })

      const response = await request(app.server)
        .post('/webhook')
        .send(
          buildWebhookPayload({
            data: {
              key: { remoteJid: '5511999999999@s.whatsapp.net', fromMe: false },
              message: {
                extendedTextMessage: { text: 'mensagem estendida' },
              },
            },
          })
        )

      expect(response.status).toBe(200)
      // A API foi chamada, provando que o texto foi extraído corretamente
      expect(mockApiGet).toHaveBeenCalledOnce()
    })

    it('deve processar áudio via audioMessage', async () => {
      // Configura os mocks para a conversão do áudio
      mockGetBase64Media.mockResolvedValueOnce({
        base64: 'fake-base64',
        mimetype: 'audio/ogg',
      })
      mockTranscribeAudio.mockResolvedValueOnce('texto extraido do audio')

      // Mock da API para a StateMachine (bot respondeu porque recebeu texto)
      mockApiGet.mockResolvedValueOnce({
        data: { user: { id: 'user-audio', name: 'User Audio' } },
      })

      const response = await request(app.server)
        .post('/webhook')
        .send(
          buildWebhookPayload({
            data: {
              key: {
                id: 'msg-123',
                remoteJid: '5511999999999@s.whatsapp.net',
                fromMe: false,
              },
              message: {
                audioMessage: { url: 'https://whatsapp.net/audio/123' },
              },
            },
          })
        )

      expect(response.status).toBe(200)
      // O EvolutionService foi chamado para baixar a mídia
      expect(mockGetBase64Media).toHaveBeenCalledWith({
        instanceName: 'minha-instancia',
        messageId: 'msg-123',
        remoteJid: '5511999999999@s.whatsapp.net',
        fromMe: false,
      })
      // O GeminiService foi chamado para transcrever
      expect(mockTranscribeAudio).toHaveBeenCalledWith(
        'fake-base64',
        'audio/ogg'
      )
      // A API simulada foi chamada, indicando que a Sate Machine continuou o fluxo
      expect(mockApiGet).toHaveBeenCalledOnce()
    })
  })

  // =========================================================================
  describe('fluxo de novo usuário', () => {
    it('happy path — deve chamar API, salvar sessão e enviar saudação', async () => {
      mockApiGet.mockResolvedValueOnce({
        data: { user: { id: 'user-123', name: 'Felipe' } },
      })

      const response = await request(app.server)
        .post('/webhook')
        .send(buildWebhookPayload())

      expect(response.status).toBe(200)
      // Verifica que a Evolution API recebeu a resposta do bot
      expect(mockSendText).toHaveBeenCalledWith({
        instanceName: 'minha-instancia',
        phone: '5511999999999',
        text: expect.stringContaining('Felipe'),
      })
    })

    it('deve remover o @s.whatsapp.net do número do telefone', async () => {
      mockApiGet.mockResolvedValueOnce({
        data: { user: { id: 'u1', name: 'Teste' } },
      })

      await request(app.server).post('/webhook').send(buildWebhookPayload())

      // Verifica que o phone enviado ao sendText não tem o sufixo do WhatsApp
      expect(mockSendText).toHaveBeenCalledWith(
        expect.objectContaining({
          instanceName: expect.any(String),
          phone: '5511999999999', // SEM @s.whatsapp.net
          text: expect.any(String),
        })
      )
    })

    it('deve responder 200 e enviar msg de cadastro quando usuário não encontrado (404)', async () => {
      mockApiGet.mockRejectedValueOnce({
        response: { status: 404 },
        message: 'Not Found',
      })

      const response = await request(app.server)
        .post('/webhook')
        .send(buildWebhookPayload())

      expect(response.status).toBe(200)
      expect(mockSendText).toHaveBeenCalledWith({
        instanceName: 'minha-instancia',
        phone: '5511999999999',
        text: expect.stringContaining('Click Proposta'),
      })
    })

    it('deve responder 200 e enviar msg de erro em falhas genéricas', async () => {
      mockApiGet.mockRejectedValueOnce(new Error('Timeout'))

      const response = await request(app.server)
        .post('/webhook')
        .send(buildWebhookPayload())

      expect(response.status).toBe(200)
      expect(mockSendText).toHaveBeenCalledWith({
        instanceName: 'minha-instancia',
        phone: '5511999999999',
        text: expect.stringContaining('deu errado'),
      })
    })
  })
})
