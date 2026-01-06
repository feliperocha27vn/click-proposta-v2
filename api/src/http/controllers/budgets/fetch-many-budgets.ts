import { NotFoundBudgets } from '@/errors/not-found-budgets'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { makeFetchManyBudgetsUseCase } from '@/factories/budgets/make-fetch-many-budgets-use-case'
import { verifyJwt } from '@/middlewares/verifyJwt'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'

export const fetchManyBudgets: FastifyPluginAsyncZod = async app => {
  app.get(
    '/budgets',
    {
      onRequest: [verifyJwt],
      schema: {
        operationId: 'fetchManyBudgets',
        tags: ['Budgets'],
        querystring: z.object({
          pageIndex: z.number().min(1).default(1),
        }),
        response: {
          200: z.object({
            budgets: z.array(
              z.object({
                id: z.string(),
                total: z.number(),
                status: z.string(),
                customerName: z.string(),
              })
            ),
          }),
          404: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { pageIndex } = request.query

      try {
        const fetchManyBudgetsUseCase = makeFetchManyBudgetsUseCase()

        const { budgets } = await fetchManyBudgetsUseCase.execute({
          usersId: request.user.sub,
          pageIndex,
        })

        return reply.status(200).send({ budgets })
      } catch (error) {
        if (error instanceof NotFoundBudgets) {
          return reply.status(404).send({ message: error.message })
        }

        if (error instanceof ResourceNotFoundError) {
          return reply.status(404).send({ message: error.message })
        }

        throw error
      }
    }
  )
}
