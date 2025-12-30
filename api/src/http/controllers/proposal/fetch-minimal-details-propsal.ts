import { makeFetchMinimalProposalDetail } from '@/factories/proposal/make-fetch-minimal-proposal-detail'
import { verifyJwt } from '@/middlewares/verifyJwt'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'

export const fetchMinimalDetailsProposal: FastifyPluginAsyncZod = async app => {
  app.get(
    '/proposals/minimal-details',
    {
      onRequest: [verifyJwt],
      schema: {
        operationId: 'fetchMinimalDetailsProposal',
        tags: ['Proposals'],
        response: {
          200: z.array(
            z.object({
              id: z.uuid(),
              name: z.string().min(2).max(100),
              title: z.string().min(2).max(100),
              totalPrice: z.string(),
              status: z.enum(['DRAFT', 'SENT', 'APPROVED', 'REJECTED']),
            })
          ),
          500: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const fetchMinimalDetailsProposalUseCase =
        makeFetchMinimalProposalDetail()

      try {
        const minimalProposals =
          await fetchMinimalDetailsProposalUseCase.execute({
            userId: request.user.sub,
          })

        return reply.status(200).send(minimalProposals)
      } catch (error) {
        console.error(error)
        return reply.status(500).send({ message: 'Internal server error.' })
      }
    }
  )
}
