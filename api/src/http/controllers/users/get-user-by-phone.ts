import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { makeGetUserByPhoneUseCase } from '@/factories/users/make-get-user-by-phone-use-case'
import { verifyServiceToken } from '@/middlewares/verify-service-token'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'

export const getUserByPhone: FastifyPluginAsyncZod = async app => {
  app.get(
    '/verify-phone',
    {
      onRequest: [verifyServiceToken],
      schema: {
        tags: ['Users'],
        operationId: 'getUserByPhone',
        querystring: z.object({
          phone: z.string(),
        }),
        response: {
          200: z.object({
            user: z.object({
              id: z.string(),
              phone: z.string(),
              email: z.email(),
              avatarUrl: z.string().nullable(),
              cnpj: z.string().nullable(),
              address: z.string().nullable(),
            }),
          }),
          404: z.object({ message: z.string() }),
          500: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      let { phone } = request.query

      if (phone.startsWith('55')) {
        phone = phone.slice(2)
      }

      try {
        const getUserByPhoneUseCase = makeGetUserByPhoneUseCase()

        const { user } = await getUserByPhoneUseCase.execute({
          phone,
        })

        return reply.status(200).send({ user })
      } catch (error) {
        if (error instanceof ResourceNotFoundError) {
          return reply.status(404).send({ message: error.message })
        }

        console.error(error)

        return reply.status(500).send({
          message: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    }
  )
}
