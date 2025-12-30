import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { makeGetCompleteRegisterUser } from '@/factories/users/make-get-complete-register-user'
import { verifyJwt } from '@/middlewares/verifyJwt'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'

export const getCompleteRegister: FastifyPluginAsyncZod = async app => {
  app.get(
    '/is-complete-register',
    {
      onRequest: [verifyJwt],
      schema: {
        tags: ['Users'],
        operationId: 'getCompleteRegister',
        response: {
          200: z.object({
            isRegisterComplete: z.boolean().optional(),
          }),
          404: z.object({
            message: z.string(),
          }),
          500: z.object({
            message: z.string(),
            error: z.string().optional(),
          }),
        },
      },
    },
    async (request, reply) => {
      const getCompleteRegister = makeGetCompleteRegisterUser()

      try {
        const { isRegisterComplete } = await getCompleteRegister.execute({
          userId: request.user.sub,
        })
        return reply.status(200).send({ isRegisterComplete })
      } catch (error) {
        console.error('Error in getCompleteRegister:', error)

        if (error instanceof ResourceNotFoundError) {
          return reply.status(404).send({ message: 'User not found' })
        }

        return reply.status(500).send({
          message: 'Internal server error',
          error: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    }
  )
}
