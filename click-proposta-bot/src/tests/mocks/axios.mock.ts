/**
 * Mock do módulo lib/axios (cliente axios para a API v2).
 * Cada teste pode configurar o comportamento via `mockApiGet` / `mockApiPost`.
 */
import { vi } from 'vitest'

export const mockApiGet = vi.fn()
export const mockApiPost = vi.fn()

export const mockApi = {
  get: mockApiGet,
  post: mockApiPost,
}
