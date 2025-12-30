import { makeSearchByNameEmailUseCase } from '@/factories/users/make-search-by-name-email-use-case'
import { verifyJwt } from '@/middlewares/verifyJwt'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'

export const searchByNameEmail: FastifyPluginAsyncZod = async app => {
  app.get(
    '/search-by-name-email',
    {
      onRequest: [verifyJwt],
      schema: {
        tags: ['Customers'],
        operationId: 'searchByNameEmail',
        querystring: z.object({
          search: z.string(),
        }),
        response: {
          200: z.object({
            customers: z.array(
              z.object({
                id: z.string().uuid(),
                name: z.string().min(2).max(100),
                email: z.string().email(),
                phone: z.string().min(10).max(15),
                createdAt: z.date(),
                updatedAt: z.date(),
              })
            ),
          }),
          404: z.object({
            message: z.string(),
          }),
          500: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { search } = request.query

      const searchByNameAndEmailUseCase = makeSearchByNameEmailUseCase()

      try {
        const { customers } = await searchByNameAndEmailUseCase.execute({
          search,
          userId: request.user.sub,
        })

        return reply.status(200).send({ customers })
      } catch (err) {
        if (err instanceof Error) {
          reply.status(500).send({
            message: err.message,
          })
        }
      }
    }
  )
}
