/**
 * Mock do GeminiService.
 * Evita chamadas reais à API do Gemini durante os testes.
 */
import { vi } from 'vitest'

export const mockExtractBudgetItems = vi.fn()

export class MockGeminiService {
  extractBudgetItems = mockExtractBudgetItems
}
