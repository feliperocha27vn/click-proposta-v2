import type { FastifyReply, FastifyRequest } from 'fastify'

export async function verifyJwt(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify()
  } catch (err) {
    console.error('❌ Erro na verificação JWT:', err)
    return reply.status(401).send({ error: 'Token inválido' })
  }
}
