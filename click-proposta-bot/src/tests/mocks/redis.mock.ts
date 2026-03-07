/**
 * Mock do ioredis — simula o Redis em memória usando um Map.
 * Implementa apenas os métodos usados no SessionRepository:
 *   hset, hgetall, expire, del
 */
export class MockRedis {
  private store: Map<string, Record<string, string>> = new Map()
  private ttls: Map<string, number> = new Map()

  async hset(key: string, fields: Record<string, unknown>): Promise<number> {
    const existing = this.store.get(key) ?? {}
    const updated: Record<string, string> = {}
    for (const [k, v] of Object.entries(fields)) {
      updated[k] = String(v)
    }
    this.store.set(key, { ...existing, ...updated })
    return Object.keys(fields).length
  }

  async hgetall(key: string): Promise<Record<string, string>> {
    return this.store.get(key) ?? {}
  }

  async expire(key: string, seconds: number): Promise<number> {
    this.ttls.set(key, seconds)
    return 1
  }

  async del(key: string): Promise<number> {
    const existed = this.store.has(key)
    this.store.delete(key)
    this.ttls.delete(key)
    return existed ? 1 : 0
  }

  /** Utilitário de teste: limpa tudo entre os testes */
  flush() {
    this.store.clear()
    this.ttls.clear()
    this.keyValues.clear()
  }

  private keyValues: Map<string, string> = new Map()

  async get(key: string): Promise<string | null> {
    return this.keyValues.get(key) ?? null
  }

  async set(
    key: string,
    value: string,
    mode?: string,
    duration?: number
  ): Promise<'OK'> {
    this.keyValues.set(key, value)
    if (mode === 'EX' && duration) {
      this.ttls.set(key, duration)
    }
    return 'OK'
  }

  /** Utilitário de teste: espia o TTL salvo */
  getTtl(key: string) {
    return this.ttls.get(key)
  }
}

export const mockRedis = new MockRedis()
