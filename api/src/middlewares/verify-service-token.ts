import type { FastifyReply, FastifyRequest } from 'fastify'
import { env } from '../env'

export async function verifyServiceToken(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const authHeader = request.headers.authorization

  if (!authHeader) {
    return reply.status(401).send({ error: 'Token de serviço ausente' })
  }

  const [, token] = authHeader.split(' ')

  if (token !== env.BOT_SERVICE_TOKEN) {
    console.error('❌ Tentativa de acesso com Service Token inválido')
    return reply.status(401).send({ error: 'Token de serviço inválido' })
  }
}
