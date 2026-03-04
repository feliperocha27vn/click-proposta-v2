/**
 * Testes unitários do StateMachineService
 *
 * Dependências externas mockadas:
 *  - lib/axios    → API v2 (verify-phone, pdf/generate)
 *  - lib/redis    → Redis in-memory
 *  - EvolutionService → sendText/sendPdf
 *  - GeminiService    → extractBudgetItems
 */
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mockApi, mockApiGet, mockApiPost } from '../mocks/axios.mock'
import {
  MockEvolutionService,
  mockSendPdf,
  mockSendText,
} from '../mocks/evolution.mock'
import { MockGeminiService, mockExtractBudgetItems } from '../mocks/gemini.mock'
import { mockRedis } from '../mocks/redis.mock'

// --- Mocks de módulos ANTES dos imports que dependem deles ---
vi.mock('../../lib/redis', () => ({ redis: mockRedis }))
vi.mock('../../lib/axios', () => ({ api: mockApi }))
vi.mock('../../services/evolution-service', () => ({
  EvolutionService: MockEvolutionService,
}))
vi.mock('../../services/gemini-service', () => ({
  GeminiService: MockGeminiService,
}))

import type { SessionRepository } from '../../repositories/session-repository'
import { StateMachineService } from '../../services/state-machine-service'

// Helper: cria um mock do sessionRepository com vi.fn() nos 3 métodos
function makeSessionRepo(overrides: Partial<SessionRepository> = {}) {
  return {
    getSession: vi.fn().mockResolvedValue(null),
    saveSession: vi.fn().mockResolvedValue(undefined),
    clearSession: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  } as unknown as SessionRepository
}

const INSTANCE = 'minha-instancia'
const PHONE = '5511999999999'

// ---------------------------------------------------------------------------
describe('StateMachineService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockRedis.flush()
  })

  // =========================================================================
  describe('processIncomingMessage — usuário novo (sem sessão)', () => {
    it('deve saudar o usuário quando o telefone existe na API', async () => {
      const sessionRepo = makeSessionRepo()
      const service = new StateMachineService(sessionRepo)

      mockApiGet.mockResolvedValueOnce({
        data: { user: { id: 'user-123', name: 'Felipe' } },
      })

      const response = await service.processIncomingMessage(PHONE, PHONE, 'Oi')

      expect(response).toContain('Felipe')
      expect(sessionRepo.saveSession).toHaveBeenCalledWith(
        PHONE,
        expect.objectContaining({ state: 'AWAITING_TYPE', userId: 'user-123' })
      )
    })

    it('deve remover o código 55 ao consultar a API para número brasileiro de 13 dígitos', async () => {
      const sessionRepo = makeSessionRepo()
      const service = new StateMachineService(sessionRepo)

      mockApiGet.mockResolvedValueOnce({
        data: { user: { id: 'u1', name: 'Teste' } },
      })

      await service.processIncomingMessage(INSTANCE, '5511999999999', 'Oi')

      // O número passado para a API deve ter o 55 removido
      expect(mockApiGet).toHaveBeenCalledWith(
        '/verify-phone',
        expect.objectContaining({
          params: { phone: '11999999999' },
        })
      )
    })

    it('deve informar sobre cadastro quando o telefone não existe (404)', async () => {
      const sessionRepo = makeSessionRepo()
      const service = new StateMachineService(sessionRepo)

      mockApiGet.mockRejectedValueOnce({
        response: { status: 404 },
        message: 'Not Found',
      })

      const response = await service.processIncomingMessage(
        INSTANCE,
        PHONE,
        'Oi'
      )

      expect(response).toContain('cadastro')
      expect(sessionRepo.saveSession).not.toHaveBeenCalled()
    })

    it('deve retornar mensagem de erro genérico para falhas de API diferentes de 404', async () => {
      const sessionRepo = makeSessionRepo()
      const service = new StateMachineService(sessionRepo)

      mockApiGet.mockRejectedValueOnce({
        response: { status: 500 },
        message: 'Internal Server Error',
      })

      const response = await service.processIncomingMessage(
        INSTANCE,
        PHONE,
        'Oi'
      )

      expect(response).toContain('problema técnico')
    })
  })

  // =========================================================================
  describe('processIncomingMessage — estado AWAITING_TYPE', () => {
    function makeRepoWithState(state: string) {
      return makeSessionRepo({
        getSession: vi.fn().mockResolvedValue({
          phone: PHONE,
          state,
          userId: 'user-123',
        }),
      })
    }

    it('deve aceitar "produto" e avançar para COLLECTING_ITEMS', async () => {
      const sessionRepo = makeRepoWithState('AWAITING_TYPE')
      const service = new StateMachineService(sessionRepo)

      const response = await service.processIncomingMessage(
        INSTANCE,
        PHONE,
        'quero fazer um orçamento de produto'
      )

      expect(response).toContain('itens')
      expect(sessionRepo.saveSession).toHaveBeenCalledWith(
        PHONE,
        expect.objectContaining({
          state: 'COLLECTING_ITEMS',
          budgetType: 'product',
        })
      )
    })

    it('deve aceitar "serviço civil" e avançar para COLLECTING_ITEMS', async () => {
      const sessionRepo = makeRepoWithState('AWAITING_TYPE')
      const service = new StateMachineService(sessionRepo)

      const response = await service.processIncomingMessage(
        INSTANCE,
        PHONE,
        'serviço civil'
      )

      expect(response).toContain('itens')
      expect(sessionRepo.saveSession).toHaveBeenCalledWith(
        PHONE,
        expect.objectContaining({
          state: 'COLLECTING_ITEMS',
          budgetType: 'civil',
        })
      )
    })

    it('deve pedir para repetir se a resposta não for reconhecida', async () => {
      const sessionRepo = makeRepoWithState('AWAITING_TYPE')
      const service = new StateMachineService(sessionRepo)

      const response = await service.processIncomingMessage(
        INSTANCE,
        PHONE,
        'não sei o que quero'
      )

      expect(response).toContain('não entendi')
      expect(sessionRepo.saveSession).not.toHaveBeenCalled()
    })
  })

  // =========================================================================
  describe('processIncomingMessage — estado COLLECTING_ITEMS', () => {
    function makeRepoCollecting(collectedData = '') {
      return makeSessionRepo({
        getSession: vi.fn().mockResolvedValue({
          phone: PHONE,
          state: 'COLLECTING_ITEMS',
          userId: 'user-123',
          budgetType: 'product',
          collectedData,
        }),
      })
    }

    it('deve acumular texto enviado pelo usuário', async () => {
      const sessionRepo = makeRepoCollecting('item anterior')
      const service = new StateMachineService(sessionRepo)

      const response = await service.processIncomingMessage(
        INSTANCE,
        PHONE,
        '2 caixas de parafuso'
      )

      expect(response).toContain('adicionado')
      expect(sessionRepo.saveSession).toHaveBeenCalledWith(
        PHONE,
        expect.objectContaining({
          collectedData: expect.stringContaining('2 caixas de parafuso'),
        })
      )
    })

    it('deve reclamar se o usuário digitar CONCLUÍDO sem ter enviado itens', async () => {
      const sessionRepo = makeRepoCollecting('') // sem itens
      const service = new StateMachineService(sessionRepo)

      const response = await service.processIncomingMessage(
        INSTANCE,
        PHONE,
        'CONCLUÍDO'
      )

      expect(response).toContain('não enviou nenhum item')
      expect(mockExtractBudgetItems).not.toHaveBeenCalled()
    })

    it('deve chamar o Gemini e avançar para CONFIRMING quando CONCLUÍDO com itens', async () => {
      const sessionRepo = makeRepoCollecting('2x parafuso R$5\n1x cimento R$30')
      const service = new StateMachineService(sessionRepo)

      mockExtractBudgetItems.mockResolvedValueOnce([
        { title: 'parafuso', amount: 2, price: 5 },
        { title: 'cimento', amount: 1, price: 30 },
      ])

      const response = await service.processIncomingMessage(
        INSTANCE,
        PHONE,
        'concluido'
      )

      expect(mockExtractBudgetItems).toHaveBeenCalledOnce()
      expect(response).toContain('resumo')
      expect(sessionRepo.saveSession).toHaveBeenCalledWith(
        PHONE,
        expect.objectContaining({ state: 'CONFIRMING' })
      )
    })

    it('deve retornar mensagem de erro se o Gemini não extrair nenhum item', async () => {
      const sessionRepo = makeRepoCollecting('texto incompreensível ###')
      const service = new StateMachineService(sessionRepo)

      mockExtractBudgetItems.mockResolvedValueOnce([])

      const response = await service.processIncomingMessage(
        INSTANCE,
        PHONE,
        'CONCLUÍDO'
      )

      expect(response).toContain('não consegui entender')
    })
  })

  // =========================================================================
  describe('processIncomingMessage — estado CONFIRMING', () => {
    function makeRepoConfirming(overrides = {}) {
      return makeSessionRepo({
        getSession: vi.fn().mockResolvedValue({
          phone: PHONE,
          state: 'CONFIRMING',
          userId: 'user-123',
          budgetType: 'product',
          extractedItems: JSON.stringify([
            { title: 'parafuso', amount: 2, price: 5 },
          ]),
          ...overrides,
        }),
      })
    }

    it('"Sim" — deve gerar o PDF e enviar pelo WhatsApp com sucesso', async () => {
      const sessionRepo = makeRepoConfirming()
      const service = new StateMachineService(sessionRepo)

      // Simula resposta da API com um buffer de PDF
      const fakePdfBuffer = Buffer.from('fake-pdf-content')
      mockApiPost.mockResolvedValueOnce({ data: fakePdfBuffer })

      const response = await service.processIncomingMessage(
        INSTANCE,
        PHONE,
        'Sim'
      )

      expect(mockSendText).toHaveBeenCalledWith(
        INSTANCE,
        PHONE,
        expect.stringContaining('aguarde')
      )
      expect(mockApiPost).toHaveBeenCalledWith(
        '/pdf/generate-product',
        expect.objectContaining({ userId: 'user-123' }),
        expect.anything()
      )
      expect(mockSendPdf).toHaveBeenCalledOnce()
      expect(sessionRepo.clearSession).toHaveBeenCalledWith(PHONE)
      expect(response).toBeNull()
    })

    it('"Sim" — deve usar o endpoint civil para budgetType = civil', async () => {
      const sessionRepo = makeRepoConfirming({ budgetType: 'civil' })
      const service = new StateMachineService(sessionRepo)

      mockApiPost.mockResolvedValueOnce({ data: Buffer.from('pdf') })

      await service.processIncomingMessage(INSTANCE, PHONE, 'Sim')

      expect(mockApiPost).toHaveBeenCalledWith(
        '/pdf/generate',
        expect.anything(),
        expect.anything()
      )
    })

    it('"Sim" — deve retornar erro interno se dados da sessão foram perdidos', async () => {
      const sessionRepo = makeSessionRepo({
        getSession: vi.fn().mockResolvedValue({
          phone: PHONE,
          state: 'CONFIRMING',
          userId: null, // userId ausente!
          extractedItems: null, // itens ausentes!
        }),
      })
      const service = new StateMachineService(sessionRepo)

      const response = await service.processIncomingMessage(
        INSTANCE,
        PHONE,
        'Sim'
      )

      expect(response).toContain('Erro interno')
      expect(sessionRepo.clearSession).toHaveBeenCalledWith(PHONE)
    })

    it('"Sim" — deve retornar erro e limpar sessão se a API de PDF falhar', async () => {
      const sessionRepo = makeRepoConfirming()
      const service = new StateMachineService(sessionRepo)

      mockApiPost.mockRejectedValueOnce(new Error('API indisponível'))

      const response = await service.processIncomingMessage(
        INSTANCE,
        PHONE,
        'Sim'
      )

      expect(response).toContain('erro técnico')
      expect(sessionRepo.clearSession).toHaveBeenCalledWith(PHONE)
    })

    it('"Não" — deve cancelar o orçamento e limpar a sessão', async () => {
      const sessionRepo = makeRepoConfirming()
      const service = new StateMachineService(sessionRepo)

      const response = await service.processIncomingMessage(
        INSTANCE,
        PHONE,
        'Não'
      )

      expect(response).toContain('cancelado')
      expect(sessionRepo.clearSession).toHaveBeenCalledWith(PHONE)
      expect(mockApiPost).not.toHaveBeenCalled()
    })
  })

  // =========================================================================
  describe('processIncomingMessage — estado inválido', () => {
    it('deve limpar a sessão e pedir para reiniciar se o estado for desconhecido', async () => {
      const sessionRepo = makeSessionRepo({
        getSession: vi.fn().mockResolvedValue({
          phone: PHONE,
          state: 'ESTADO_INVALIDO_QUALQUER',
        }),
      })
      const service = new StateMachineService(sessionRepo)

      const response = await service.processIncomingMessage(
        INSTANCE,
        PHONE,
        'qualquer coisa'
      )

      expect(sessionRepo.clearSession).toHaveBeenCalledWith(PHONE)
      expect(response).toContain('reinicie')
    })
  })
})
