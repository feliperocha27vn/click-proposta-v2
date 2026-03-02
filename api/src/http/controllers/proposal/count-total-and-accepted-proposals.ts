import { makeCountProposalsAndTotalProposalsUseCase } from '@/factories/proposal/make-count-proposals-and-total-proposals-use-case'
import { verifyJwt } from '@/middlewares/verifyJwt'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'

export const countTotalAndAcceptedProposalsController: FastifyPluginAsyncZod =
  async app => {
    app.get(
      '/proposals/count',
      {
        onRequest: [verifyJwt],
        schema: {
          tags: ['Proposals'],
          operationId: 'countTotalAndAcceptedProposals',
          response: {
            200: z.object({
              accepted: z.number(),
              total: z.number(),
            }),
            500: z.object({ error: z.string() }),
          },
        },
      },
      async (request, reply) => {
        try {
          const countProposalsAndTotalProposalsUseCase =
            makeCountProposalsAndTotalProposalsUseCase()

          const { accepted, total } =
            await countProposalsAndTotalProposalsUseCase.execute({
              userId: request.user.sub,
            })

          return reply.status(200).send({ accepted, total })
        } catch (error) {
          console.error('Error counting proposals:', error)
          reply.status(500).send({ error: 'Internal Server Error' })
        }
      }
    )
  }
