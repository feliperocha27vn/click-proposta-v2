import { makeGetProposalAndBudgetStatsUseCase } from '@/factories/proposal/make-get-proposal-and-budget-stats-use-case'
import { verifyJwt } from '@/middlewares/verifyJwt'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'

export const getProposalAndBudgetStatsController: FastifyPluginAsyncZod =
  async app => {
    app.get(
      '/proposals/stats',
      {
        onRequest: [verifyJwt],
        schema: {
          tags: ['Proposals'],
          operationId: 'getProposalAndBudgetStats',
          response: {
            200: z.object({
              stats: z.array(
                z.object({
                  date: z.string(),
                  count: z.number(),
                })
              ),
            }),
            500: z.object({ error: z.string() }),
          },
        },
      },
      async (request, reply) => {
        try {
          const getProposalAndBudgetStatsUseCase =
            makeGetProposalAndBudgetStatsUseCase()

          const { stats } = await getProposalAndBudgetStatsUseCase.execute({
            userId: request.user.sub,
          })

          return reply.status(200).send({ stats })
        } catch (error) {
          console.error('Error fetching proposal stats:', error)
          reply.status(500).send({ error: 'Internal Server Error' })
        }
      }
    )
  }
