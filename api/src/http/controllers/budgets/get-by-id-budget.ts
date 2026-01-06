import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { makeGetByIdBudgetUseCase } from '@/factories/budgets/make-get-by-id-budget-use-case'
import { verifyJwt } from '@/middlewares/verifyJwt'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'

export const getByIdBudget: FastifyPluginAsyncZod = async app => {
  app.get(
    '/budgets/:budgetId',
    {
      onRequest: [verifyJwt],
      schema: {
        operationId: 'getByIdBudget',
        tags: ['Budgets'],
        params: z.object({
          budgetId: z.uuid(),
        }),
        response: {
          200: z.object({
            budget: z.object({
              id: z.string(),
              total: z.number(),
              status: z.string(),
              customersId: z.string(),
              budgetsServices: z.array(
                z.object({
                  id: z.string(),
                  title: z.string(),
                  description: z.string(),
                })
              ),
            }),
          }),
          404: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { budgetId } = request.params

      try {
        const getByIdBudgetUseCase = makeGetByIdBudgetUseCase()

        const { budget } = await getByIdBudgetUseCase.execute({
          budgetId,
          usersId: request.user.sub,
        })

        return reply.status(200).send({ budget })
      } catch (error) {
        if (error instanceof ResourceNotFoundError) {
          return reply.status(404).send({ message: 'Budget not found' })
        }

        throw error
      }
    }
  )
}
