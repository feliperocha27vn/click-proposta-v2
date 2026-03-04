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
  MockSendPdfUseCase,
  MockSendTextUseCase,
  mockSendPdf,
  mockSendText,
} from '../mocks/evolution.mock'
import { MockGeminiService, mockExtractBudgetItems } from '../mocks/gemini.mock'
import { mockRedis } from '../mocks/redis.mock'

// --- Mocks de módulos ANTES dos imports que dependem deles ---
vi.mock('../../lib/redis', () => ({ redis: mockRedis }))
vi.mock('../../lib/axios', () => ({ api: mockApi }))
vi.mock('../../use-cases/evolution/send-text', () => ({
  SendTextUseCase: MockSendTextUseCase,
}))
vi.mock('../../use-cases/evolution/send-pdf', () => ({
  SendPdfUseCase: MockSendPdfUseCase,
}))
vi.mock('../../lib/gemini', () => ({
  GeminiService: MockGeminiService,
}))

import { GeminiService } from '../../lib/gemini'
import type { SessionRepository } from '../../repositories/session-repository'
import { HandleAwaitingTypeUseCase } from '../../use-cases/bot/handle-awaiting-type'
import { HandleCollectingItemsUseCase } from '../../use-cases/bot/handle-collecting-items'
import { HandleConfirmingUseCase } from '../../use-cases/bot/handle-confirming'
import { HandleNewUserUseCase } from '../../use-cases/bot/handle-new-user'
import { ProcessIncomingMessageUseCase } from '../../use-cases/bot/process-incoming-message'
import { SendPdfUseCase } from '../../use-cases/evolution/send-pdf'
import { SendTextUseCase } from '../../use-cases/evolution/send-text'

function makeService(sessionRepo: SessionRepository) {
  return new ProcessIncomingMessageUseCase(
    sessionRepo,
    new HandleNewUserUseCase(sessionRepo),
    new HandleAwaitingTypeUseCase(sessionRepo),
    new HandleCollectingItemsUseCase(sessionRepo, new GeminiService()),
    new HandleConfirmingUseCase(
      sessionRepo,
      new SendTextUseCase(),
      new SendPdfUseCase()
    )
  )
}

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
describe('ProcessIncomingMessageUseCase', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockRedis.flush()
  })

  // =========================================================================
  describe('processIncomingMessage — usuário novo (sem sessão)', () => {
    it('deve saudar o usuário pelo nome quando o telefone existe na API', async () => {
      const sessionRepo = makeSessionRepo()
      const service = makeService(sessionRepo)

      mockApiGet.mockResolvedValueOnce({
        data: { user: { id: 'user-123', name: 'Felipe' } },
      })

      const response = await service.execute({
        instanceName: INSTANCE,
        phone: PHONE,
        text: 'Oi',
      })

      expect(response).toContain('Felipe')
      expect(response).toContain('1')
      expect(response).toContain('2')
      expect(sessionRepo.saveSession).toHaveBeenCalledWith(
        PHONE,
        expect.objectContaining({ state: 'AWAITING_TYPE', userId: 'user-123' })
      )
    })

    it('deve usar "cliente" no nome quando o usuário não tem nome cadastrado', async () => {
      const sessionRepo = makeSessionRepo()
      const service = makeService(sessionRepo)

      mockApiGet.mockResolvedValueOnce({
        data: { user: { id: 'user-123', name: null } },
      })

      const response = await service.execute({
        instanceName: INSTANCE,
        phone: PHONE,
        text: 'Oi',
      })

      expect(response).toContain('cliente')
    })

    it('deve remover o código 55 ao consultar a API para número brasileiro de 13 dígitos', async () => {
      const sessionRepo = makeSessionRepo()
      const service = makeService(sessionRepo)

      mockApiGet.mockResolvedValueOnce({
        data: { user: { id: 'u1', name: 'Teste' } },
      })

      await service.execute({
        instanceName: INSTANCE,
        phone: '5511999999999',
        text: 'Oi',
      })

      expect(mockApiGet).toHaveBeenCalledWith(
        '/verify-phone',
        expect.objectContaining({
          params: { phone: '11999999999' },
        })
      )
    })

    it('deve informar sobre cadastro com link quando o telefone não existe (404)', async () => {
      const sessionRepo = makeSessionRepo()
      const service = makeService(sessionRepo)

      mockApiGet.mockRejectedValueOnce({
        response: { status: 404 },
        message: 'Not Found',
      })

      const response = await service.execute({
        instanceName: INSTANCE,
        phone: PHONE,
        text: 'Oi',
      })

      expect(response).toContain('Click Proposta')
      expect(response).toContain('https://click-proposta.umdoce.dev.br/login')
      expect(sessionRepo.saveSession).not.toHaveBeenCalled()
    })

    it('deve retornar mensagem de erro empática para falhas de API diferentes de 404', async () => {
      const sessionRepo = makeSessionRepo()
      const service = makeService(sessionRepo)

      mockApiGet.mockRejectedValueOnce({
        response: { status: 500 },
        message: 'Internal Server Error',
      })

      const response = await service.execute({
        instanceName: INSTANCE,
        phone: PHONE,
        text: 'Oi',
      })

      expect(response).toContain('deu errado')
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

    it('deve aceitar "1" como seleção de produto', async () => {
      const sessionRepo = makeRepoWithState('AWAITING_TYPE')
      const service = makeService(sessionRepo)

      const response = await service.execute({
        instanceName: INSTANCE,
        phone: PHONE,
        text: '1',
      })

      expect(response).toContain('itens')
      expect(sessionRepo.saveSession).toHaveBeenCalledWith(
        PHONE,
        expect.objectContaining({
          state: 'COLLECTING_ITEMS',
          budgetType: 'product',
        })
      )
    })

    it('deve aceitar "produto" por extenso', async () => {
      const sessionRepo = makeRepoWithState('AWAITING_TYPE')
      const service = makeService(sessionRepo)

      const response = await service.execute({
        instanceName: INSTANCE,
        phone: PHONE,
        text: 'quero orçamento de produto',
      })

      expect(response).toContain('itens')
      expect(sessionRepo.saveSession).toHaveBeenCalledWith(
        PHONE,
        expect.objectContaining({ budgetType: 'product' })
      )
    })

    it('deve aceitar "2" como seleção de serviço civil', async () => {
      const sessionRepo = makeRepoWithState('AWAITING_TYPE')
      const service = makeService(sessionRepo)

      const response = await service.execute({
        instanceName: INSTANCE,
        phone: PHONE,
        text: '2',
      })

      expect(response).toContain('itens')
      expect(sessionRepo.saveSession).toHaveBeenCalledWith(
        PHONE,
        expect.objectContaining({
          state: 'COLLECTING_ITEMS',
          budgetType: 'civil',
        })
      )
    })

    it('deve aceitar "serviço civil" por extenso', async () => {
      const sessionRepo = makeRepoWithState('AWAITING_TYPE')
      const service = makeService(sessionRepo)

      const response = await service.execute({
        instanceName: INSTANCE,
        phone: PHONE,
        text: 'serviço civil',
      })

      expect(response).toContain('itens')
      expect(sessionRepo.saveSession).toHaveBeenCalledWith(
        PHONE,
        expect.objectContaining({ budgetType: 'civil' })
      )
    })

    it('deve mostrar as opções novamente se a resposta não for reconhecida', async () => {
      const sessionRepo = makeRepoWithState('AWAITING_TYPE')
      const service = makeService(sessionRepo)

      const response = await service.execute({
        instanceName: INSTANCE,
        phone: PHONE,
        text: 'não sei',
      })

      expect(response).toContain('Não entendi')
      expect(response).toContain('*1*')
      expect(response).toContain('*2*')
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

    it('deve acumular texto enviado pelo usuário e confirmar com "Anotado"', async () => {
      const sessionRepo = makeRepoCollecting('item anterior')
      const service = makeService(sessionRepo)

      const response = await service.execute({
        instanceName: INSTANCE,
        phone: PHONE,
        text: '2 caixas de parafuso',
      })

      expect(response).toContain('Anotado')
      expect(sessionRepo.saveSession).toHaveBeenCalledWith(
        PHONE,
        expect.objectContaining({
          collectedData: expect.stringContaining('2 caixas de parafuso'),
        })
      )
    })

    it('deve reclamar se o usuário enviar 1 sem ter adicionado nenhum item', async () => {
      const sessionRepo = makeRepoCollecting('')
      const service = makeService(sessionRepo)

      const response = await service.execute({
        instanceName: INSTANCE,
        phone: PHONE,
        text: '1',
      })

      expect(response).toContain('nenhum item')
      expect(response).toContain('Exemplo')
      expect(mockExtractBudgetItems).not.toHaveBeenCalled()
    })

    it('deve chamar o Gemini e avançar para CONFIRMING quando digitar 1 com itens', async () => {
      const sessionRepo = makeRepoCollecting('2x parafuso R$5\n1x cimento R$30')
      const service = makeService(sessionRepo)

      mockExtractBudgetItems.mockResolvedValueOnce([
        { title: 'parafuso', amount: 2, price: 5 },
        { title: 'cimento', amount: 1, price: 30 },
      ])

      const response = await service.execute({
        instanceName: INSTANCE,
        phone: PHONE,
        text: '1',
      })

      expect(mockExtractBudgetItems).toHaveBeenCalledOnce()
      expect(response).toContain('Resumo')
      expect(response).toContain('Sim')
      expect(response).toContain('Não')
      expect(sessionRepo.saveSession).toHaveBeenCalledWith(
        PHONE,
        expect.objectContaining({ state: 'CONFIRMING' })
      )
    })

    it('deve mostrar exemplo de formato se o Gemini não extrair nenhum item', async () => {
      const sessionRepo = makeRepoCollecting('texto incompreensível ###')
      const service = makeService(sessionRepo)

      mockExtractBudgetItems.mockResolvedValueOnce([])

      const response = await service.execute({
        instanceName: INSTANCE,
        phone: PHONE,
        text: '1',
      })

      expect(response).toContain('Não consegui identificar')
      expect(response).toContain('Exemplo')
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

    it('"Sim" — deve enviar msg de progresso, gerar PDF e enviar pelo WhatsApp', async () => {
      const sessionRepo = makeRepoConfirming()
      const service = makeService(sessionRepo)

      const fakePdfBuffer = Buffer.from('fake-pdf-content')
      mockApiPost.mockResolvedValueOnce({ data: fakePdfBuffer })

      const response = await service.execute({
        instanceName: INSTANCE,
        phone: PHONE,
        text: 'Sim',
      })

      expect(mockSendText).toHaveBeenCalledWith(
        expect.objectContaining({
          instanceName: INSTANCE,
          phone: PHONE,
          text: expect.stringContaining('Aguarde'),
        })
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

    it('"Sim" — deve usar o endpoint /pdf/generate para budgetType = civil', async () => {
      const sessionRepo = makeRepoConfirming({ budgetType: 'civil' })
      const service = makeService(sessionRepo)

      mockApiPost.mockResolvedValueOnce({ data: Buffer.from('pdf') })

      await service.execute({
        instanceName: INSTANCE,
        phone: PHONE,
        text: 'Sim',
      })

      expect(mockApiPost).toHaveBeenCalledWith(
        '/pdf/generate',
        expect.anything(),
        expect.anything()
      )
    })

    it('"Sim" — deve retornar "Ops!" se dados da sessão foram perdidos', async () => {
      const sessionRepo = makeSessionRepo({
        getSession: vi.fn().mockResolvedValue({
          phone: PHONE,
          state: 'CONFIRMING',
          userId: null,
          extractedItems: null,
        }),
      })
      const service = makeService(sessionRepo)

      const response = await service.execute({
        instanceName: INSTANCE,
        phone: PHONE,
        text: 'Sim',
      })

      expect(response).toContain('Ops!')
      expect(sessionRepo.clearSession).toHaveBeenCalledWith(PHONE)
    })

    it('"Sim" — deve limpar sessão e orientar nova tentativa se a API de PDF falhar', async () => {
      const sessionRepo = makeRepoConfirming()
      const service = makeService(sessionRepo)

      mockApiPost.mockRejectedValueOnce(new Error('API indisponível'))

      const response = await service.execute({
        instanceName: INSTANCE,
        phone: PHONE,
        text: 'Sim',
      })

      expect(response).toContain('Não conseguimos gerar')
      expect(sessionRepo.clearSession).toHaveBeenCalledWith(PHONE)
    })

    it('"Não" — deve cancelar o orçamento e limpar a sessão', async () => {
      const sessionRepo = makeRepoConfirming()
      const service = makeService(sessionRepo)

      const response = await service.execute({
        instanceName: INSTANCE,
        phone: PHONE,
        text: 'Não',
      })

      expect(response).toContain('cancelado')
      expect(response).toContain('Oi')
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
      const service = makeService(sessionRepo)

      const response = await service.execute({
        instanceName: INSTANCE,
        phone: PHONE,
        text: 'qualquer coisa',
      })

      expect(sessionRepo.clearSession).toHaveBeenCalledWith(PHONE)
      expect(response).toContain('Reiniciamos')
    })
  })
})
