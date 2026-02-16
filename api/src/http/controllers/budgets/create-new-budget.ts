import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { makeCreateNewBudgetUseCase } from '@/factories/budgets/make-create-new-budget-use-case'
import { verifyJwt } from '@/middlewares/verifyJwt'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'

export const createNewBudget: FastifyPluginAsyncZod = async app => {
  app.post(
    '/budgets',
    {
      onRequest: [verifyJwt],
      schema: {
        tags: ['Budgets'],
        body: z.object({
          customerId: z.uuid(),
          userId: z.uuid(),
          total: z.number(),
          services: z.array(
            z.object({
              id: z.string(),
              title: z.string(),
              description: z.string(),
              quantity: z.number().optional().nullable(),
              price: z.number().optional().nullable(),
            })
          ),
        }),
        response: {
          201: z.void(),
          404: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { customerId, userId, total, services } = request.body

      try {
        const createNewBudgetUseCase = makeCreateNewBudgetUseCase()

        await createNewBudgetUseCase.execute({
          customerId,
          userId,
          total,
          services,
        })

        return reply.status(201).send()
      } catch (error) {
        if (error instanceof ResourceNotFoundError) {
          return reply.status(404).send({
            message: error.message,
          })
        }

        throw error
      }
    }
  )
}
