import 'dotenv/config'
import { execSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import type { Environment } from 'vitest/environments'

function generateDatabaseUrl(schema: string) {
  if (!process.env.DATABASE_URL_TEST) {
    throw new Error('Please provide a DATABASE_URL_TEST env variable')
  }

  const url = new URL(process.env.DATABASE_URL_TEST)
  url.searchParams.set('schema', schema)

  return url.toString()
}

function generateDirectUrl(schema: string) {
  if (!process.env.DIRECT_URL_TEST) {
    return null
  }

  const url = new URL(process.env.DIRECT_URL_TEST)
  url.searchParams.set('schema', schema)

  return url.toString()
}

export default (<Environment>{
  name: 'prisma',
  viteEnvironment: 'ssr',
  async setup() {
    const schema = randomUUID()
    const databaseUrl = generateDatabaseUrl(schema)
    const directUrl = generateDirectUrl(schema)

    // Atribuir as URLs com o schema único
    process.env.DATABASE_URL_TEST = databaseUrl

    if (directUrl) {
      process.env.DIRECT_URL_TEST = directUrl
    }

    try {
      execSync('npx prisma db push --force-reset --skip-generate', {
        stdio: 'inherit',
        env: process.env,
      })
    } catch (error) {
      console.error('Failed to push database schema:', error)
      throw error
    }

    return {
      async teardown() {
        const { prisma } = await import('../../src/lib/prisma.js')

        try {
          await prisma.$executeRawUnsafe(
            `DROP SCHEMA IF EXISTS "${schema}" CASCADE`
          )
        } catch (error) {
          console.warn(`Failed to cleanup schema ${schema}:`, error)
        } finally {
          await prisma.$disconnect()
        }
      },
    }
  },
})
