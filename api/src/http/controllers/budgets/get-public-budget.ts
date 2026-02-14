import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { makeGetPublicBudgetUseCase } from '@/factories/budgets/make-get-public-budget-use-case'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'

export const getPublicBudget: FastifyPluginAsyncZod = async app => {
  app.get(
    '/public/budgets/:budgetId',
    {
      schema: {
        operationId: 'getPublicBudget',
        tags: ['Budgets'],
        summary: 'Get public budget details',
        description:
          'Fetch budget details for public viewing without authentication.',
        params: z.object({
          budgetId: z.uuid(),
        }),
        response: {
          200: z.object({
            budget: z.object({
              id: z.string(),
              title: z.string(),
              description: z.string().optional(),
              total: z.number(),
              status: z.string(),
              createdAt: z.date(),
              customer: z.object({
                name: z.string(),
              }),
              user: z.object({
                name: z.string().nullable(),
                avatarUrl: z.string().nullable(),
              }),
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
        const getPublicBudgetUseCase = makeGetPublicBudgetUseCase()

        const { budget } = await getPublicBudgetUseCase.execute({
          budgetId,
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
