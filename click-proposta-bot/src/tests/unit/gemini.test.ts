/**
 * Testes unitários do GeminiService
 *
 * O cliente do Gemini (`lib/gemini`) é mockado, então
 * nenhuma chamada real à API da Google é feita.
 */
import { beforeEach, describe, expect, it, vi } from 'vitest'

// vi.hoisted garante que a variável existe ANTES do hoisting do vi.mock
const { mockGenerateContent } = vi.hoisted(() => ({
  mockGenerateContent: vi.fn(),
}))

vi.mock('@google/genai', async importOriginal => {
  const actual = await importOriginal<typeof import('@google/genai')>()
  return {
    ...actual,
    GoogleGenAI: class {
      models = { generateContent: mockGenerateContent }
    },
  }
})

import { GeminiService } from '../../lib/gemini'

// Helper: monta a resposta fake do Gemini no novo formato { _raciocinio, items }
function makeFakeResponse(
  items: object[],
  raciocinio = 'Raciocínio de teste.'
) {
  return {
    text: JSON.stringify({ _raciocinio: raciocinio, items }),
  }
}

// ---------------------------------------------------------------------------
describe('GeminiService', () => {
  let service: GeminiService

  beforeEach(() => {
    vi.clearAllMocks()
    service = new GeminiService()
  })

  // =========================================================================
  describe('extractBudgetItems', () => {
    it('deve extrair itens simples de uma mensagem clara', async () => {
      mockGenerateContent.mockResolvedValueOnce(
        makeFakeResponse([
          { title: 'Pastilha De Freio', amount: 3, price: null },
        ])
      )

      const result = await service.extractBudgetItems(
        'manda 3 pastilha de freio',
        'product'
      )

      expect(result).toHaveLength(1)
      expect(result[0].title).toBe('Pastilha De Freio')
      expect(result[0].amount).toBe(3)
      expect(result[0].price).toBeNull()
    })

    it('deve extrair múltiplos itens de uma mensagem com gírias', async () => {
      mockGenerateContent.mockResolvedValueOnce(
        makeFakeResponse([
          { title: 'Pneu Aro 15', amount: 2, price: null },
          { title: 'Óleo Para Motor', amount: 6, price: 30.0 },
        ])
      )

      const result = await service.extractBudgetItems(
        'fala meu truta blz me ve ai um par de pneu aro 15 e meia duzia de oleo pra motor paguei 30 conto cada blz',
        'product'
      )

      expect(result).toHaveLength(2)

      const pneu = result.find(i => i.title === 'Pneu Aro 15')
      expect(pneu?.amount).toBe(2)
      expect(pneu?.price).toBeNull() // preço não foi declarado para o pneu

      const oleo = result.find(i => i.title === 'Óleo Para Motor')
      expect(oleo?.amount).toBe(6) // meia dúzia = 6
      expect(oleo?.price).toBe(30.0)
    })

    it('deve extrair item com preço explícito', async () => {
      mockGenerateContent.mockResolvedValueOnce(
        makeFakeResponse([{ title: 'Cimento 50Kg', amount: 5, price: 35.5 }])
      )

      const result = await service.extractBudgetItems(
        '5 sacos de cimento 50kg cada um custou R$35,50',
        'civil'
      )

      expect(result[0].price).toBe(35.5)
    })

    it('deve retornar price null quando o preço não for informado', async () => {
      mockGenerateContent.mockResolvedValueOnce(
        makeFakeResponse([{ title: 'Tijolo', amount: 1000, price: null }])
      )

      const result = await service.extractBudgetItems('1000 tijolos', 'civil')

      expect(result[0].price).toBeNull()
    })

    it('deve retornar array vazio quando a resposta do Gemini estiver vazia', async () => {
      mockGenerateContent.mockResolvedValueOnce({ text: '' })

      const result = await service.extractBudgetItems(
        'qualquer texto',
        'product'
      )

      expect(result).toEqual([])
    })

    it('deve retornar array vazio quando a resposta do Gemini retornar null/undefined', async () => {
      mockGenerateContent.mockResolvedValueOnce({ text: null })

      const result = await service.extractBudgetItems(
        'qualquer texto',
        'product'
      )

      expect(result).toEqual([])
    })

    it('deve retornar array vazio quando o campo items estiver ausente na resposta', async () => {
      mockGenerateContent.mockResolvedValueOnce({
        text: JSON.stringify({
          _raciocinio: 'Algo saiu errado',
          items: undefined,
        }),
      })

      const result = await service.extractBudgetItems(
        'texto quebrado',
        'product'
      )

      expect(result).toEqual([])
    })

    it('deve retornar array vazio em caso de erro na chamada da API', async () => {
      mockGenerateContent.mockRejectedValueOnce(new Error('API indisponível'))

      const result = await service.extractBudgetItems(
        'qualquer texto',
        'product'
      )

      expect(result).toEqual([])
    })

    it('deve retornar array vazio quando o JSON retornado for inválido', async () => {
      mockGenerateContent.mockResolvedValueOnce({
        text: 'não é um json válido {{{',
      })

      const result = await service.extractBudgetItems(
        'qualquer texto',
        'product'
      )

      expect(result).toEqual([])
    })

    it('deve passar o budgetType correto no prompt para orçamento civil', async () => {
      mockGenerateContent.mockResolvedValueOnce(
        makeFakeResponse([{ title: 'Mão De Obra', amount: 1, price: null }])
      )

      await service.extractBudgetItems('instalação de pia', 'civil')

      const callArg = mockGenerateContent.mock.calls[0][0]
      expect(callArg.contents).toContain('Serviço Civil')
    })

    it('deve passar o budgetType correto no prompt para orçamento de produtos', async () => {
      mockGenerateContent.mockResolvedValueOnce(
        makeFakeResponse([{ title: 'Parafuso', amount: 10, price: null }])
      )

      await service.extractBudgetItems('10 parafusos', 'product')

      const callArg = mockGenerateContent.mock.calls[0][0]
      expect(callArg.contents).toContain('Produtos')
    })

    it('deve chamar o Gemini com temperatura 0 para extração determinística', async () => {
      mockGenerateContent.mockResolvedValueOnce(
        makeFakeResponse([{ title: 'Item', amount: 1, price: null }])
      )

      await service.extractBudgetItems('um item', 'product')

      const callArg = mockGenerateContent.mock.calls[0][0]
      expect(callArg.config?.temperature).toBe(0)
    })
  })

  // =========================================================================
  describe('transcribeAudio', () => {
    it('deve transcrever áudio em base64 com sucesso', async () => {
      mockGenerateContent.mockResolvedValueOnce({
        text: 'este é um teste de transcrição de áudio',
      })

      const base64 = 'U29tZUZha2VCYXNlNjRBdWRpbw=='
      const mimeType = 'audio/ogg; codecs=opus'

      const result = await service.transcribeAudio(base64, mimeType)

      expect(result).toBe('este é um teste de transcrição de áudio')

      const callArg = mockGenerateContent.mock.calls[0][0]
      expect(callArg.model).toBe('gemini-2.5-flash')
      expect(callArg.config.temperature).toBe(0)

      const parts = callArg.contents[0].parts
      expect(parts[0].text).toContain('Transcreva este áudio exatamente')
      expect(parts[1].inlineData.data).toBe(base64)
      expect(parts[1].inlineData.mimeType).toBe(mimeType)
    })

    it('deve retornar string vazia caso o retorno seja nulo', async () => {
      mockGenerateContent.mockResolvedValueOnce({ text: null })

      const result = await service.transcribeAudio('base64', 'audio/ogg')

      expect(result).toBe('')
    })

    it('deve retornar string vazia em caso de erro na chamada do Gemini', async () => {
      mockGenerateContent.mockRejectedValueOnce(new Error('API Inacessível'))

      const result = await service.transcribeAudio('base64', 'audio/ogg')

      expect(result).toBe('')
    })
  })
})
