import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { makeGetUserByIdUseCase } from '@/factories/users/make-get-user-by-id-use-case'
import { verifyJwt } from '@/middlewares/verifyJwt'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'

export const getMe: FastifyPluginAsyncZod = async app => {
  app.get(
    '/me',
    {
      onRequest: [verifyJwt],
      schema: {
        tags: ['Users'],
        operationId: 'getMe',
        response: {
          200: z.object({
            user: z.object({
              id: z.string(),
              email: z.email(),
              name: z.string().nullable(),
              avatarUrl: z.string().nullable(),
              plan: z.enum(['FREE', 'PRO']),
              isRegisterComplete: z.boolean(),
            }),
          }),
          404: z.object({ message: z.string() }),
          500: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const getUserByIdUseCase = makeGetUserByIdUseCase()
      try {
        const { user } = await getUserByIdUseCase.execute({
          userId: request.user.sub,
        })

        return reply.status(200).send({ user })
      } catch (error) {
        if (error instanceof ResourceNotFoundError) {
          return reply.status(404).send({ message: error.message })
        }

        return reply.status(500).send({ message: 'Internal server error.' })
      }
    }
  )
}
