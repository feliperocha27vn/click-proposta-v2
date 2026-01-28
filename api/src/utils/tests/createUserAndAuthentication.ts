import { prisma } from '@/lib/prisma'
import type { FastifyInstance } from 'fastify'

export async function createUserAndAuthentication(app: FastifyInstance) {
  const user = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: `teste${Math.floor(Math.random() * 1000)}@example.com`,
      isRegisterComplete: true,
    },
  })

  const token = await app.jwt.sign({
    sub: user.id,
  })

  return {
    user,
    token,
  }
}
