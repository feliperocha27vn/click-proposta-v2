/**
 * Testes unitários do SessionRepository
 *
 * O Redis é substituído pelo MockRedis (in-memory),
 * então nenhuma conexão real é feita.
 */
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mockRedis } from '../mocks/redis.mock'

// Mock do módulo Redis antes de importar o repository
vi.mock('../../lib/redis', () => ({ redis: mockRedis }))

import { SessionRepository } from '../../repositories/session-repository'

describe('SessionRepository', () => {
  let repo: SessionRepository

  beforeEach(() => {
    mockRedis.flush() // garante estado limpo antes de cada teste
    repo = new SessionRepository()
  })

  // -------------------------------------------------------------------------
  describe('getSession', () => {
    it('deve retornar null quando a sessão não existe', async () => {
      const result = await repo.getSession('5511999999999')
      expect(result).toBeNull()
    })

    it('deve retornar os dados da sessão quando ela existe', async () => {
      // Simula uma sessão salva anteriormente
      await mockRedis.hset('session:5511999999999', {
        phone: '5511999999999',
        state: 'AWAITING_TYPE',
        userId: 'user-123',
      })

      const result = await repo.getSession('5511999999999')

      expect(result).not.toBeNull()
      expect(result?.phone).toBe('5511999999999')
      expect(result?.state).toBe('AWAITING_TYPE')
      expect(result?.userId).toBe('user-123')
    })
  })

  // -------------------------------------------------------------------------
  describe('saveSession', () => {
    it('deve salvar os campos na chave correta do Redis', async () => {
      await repo.saveSession('5511999999999', {
        phone: '5511999999999',
        state: 'AWAITING_TYPE',
        userId: 'user-abc',
      })

      const stored = await mockRedis.hgetall('session:5511999999999')
      expect(stored.state).toBe('AWAITING_TYPE')
      expect(stored.userId).toBe('user-abc')
    })

    it('deve fazer merge (patch) em vez de sobrescrever tudo', async () => {
      // Salva sessão inicial
      await repo.saveSession('5511999999999', {
        phone: '5511999999999',
        state: 'AWAITING_TYPE',
        userId: 'user-abc',
      })

      // Atualiza apenas o estado
      await repo.saveSession('5511999999999', {
        state: 'COLLECTING_ITEMS',
        budgetType: 'product',
      })

      const stored = await mockRedis.hgetall('session:5511999999999')
      // O userId original deve continuar presente
      expect(stored.userId).toBe('user-abc')
      // O estado deve ter sido atualizado
      expect(stored.state).toBe('COLLECTING_ITEMS')
      expect(stored.budgetType).toBe('product')
    })

    it('deve definir o TTL de 15 minutos (900 segundos)', async () => {
      await repo.saveSession('5511999999999', {
        phone: '5511999999999',
        state: 'AWAITING_TYPE',
      })

      const ttl = mockRedis.getTtl('session:5511999999999')
      expect(ttl).toBe(60 * 15)
    })
  })

  // -------------------------------------------------------------------------
  describe('clearSession', () => {
    it('deve deletar a sessão do Redis', async () => {
      await mockRedis.hset('session:5511999999999', {
        phone: '5511999999999',
        state: 'CONFIRMING',
      })

      await repo.clearSession('5511999999999')

      const result = await repo.getSession('5511999999999')
      expect(result).toBeNull()
    })

    it('não deve lançar erro mesmo se a sessão não existir', async () => {
      await expect(
        repo.clearSession('5511999999999-inexistente')
      ).resolves.not.toThrow()
    })
  })
})
