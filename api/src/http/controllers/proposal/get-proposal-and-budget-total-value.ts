import { makeGetProposalAndBudgetTotalValueUseCase } from '@/factories/proposal/make-get-proposal-and-budget-total-value-use-case'
import { verifyJwt } from '@/middlewares/verifyJwt'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'

export const getProposalAndBudgetTotalValueController: FastifyPluginAsyncZod =
  async app => {
    app.get(
      '/proposals/total-value',
      {
        onRequest: [verifyJwt],
        schema: {
          tags: ['Proposals'],
          operationId: 'getProposalAndBudgetTotalValue',
          response: {
            200: z.object({
              totalValue: z.number(),
            }),
            500: z.object({ error: z.string() }),
          },
        },
      },
      async (request, reply) => {
        try {
          const getProposalAndBudgetTotalValueUseCase =
            makeGetProposalAndBudgetTotalValueUseCase()

          const { totalValue } = await getProposalAndBudgetTotalValueUseCase.execute({
            userId: request.user.sub,
          })

          return reply.status(200).send({ totalValue })
        } catch (error) {
          console.error('Error fetching proposal total value:', error)
          reply.status(500).send({ error: 'Internal Server Error' })
        }
      }
    )
  }
