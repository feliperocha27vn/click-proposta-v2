/**
 * Mock do EvolutionService.
 * Impede que chamadas reais à Evolution API sejam feitas nos testes.
 */
import { vi } from 'vitest'

export const mockSendText = vi.fn().mockResolvedValue(undefined)
export const mockSendPdf = vi.fn().mockResolvedValue(undefined)
export const mockGetBase64Media = vi.fn().mockResolvedValue(null)

export class MockSendTextUseCase {
  execute = mockSendText
}
export class MockSendPdfUseCase {
  execute = mockSendPdf
}
export class MockGetBase64MediaUseCase {
  execute = mockGetBase64Media
}
