import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { makeGetLastDraftProposal } from '@/factories/proposal/make-get-last-draft-proposal'
import { verifyJwt } from '@/middlewares/verifyJwt'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'

export const getLastDraftProposal: FastifyPluginAsyncZod = async app => {
  app.get(
    '/draft-proposals/:customerId/last',
    {
      onRequest: [verifyJwt],
      schema: {
        tags: ['DraftProposals'],
        operationId: 'getLastDraftProposal',
        params: z.object({
          customerId: z.string().uuid(),
        }),
        response: {
          200: z.object({
            proposalDraft: z.object({
              title: z.string(),
              welcomeDescription: z.string(),
              whyUs: z.string(),
              challenge: z.string(),
              solution: z.string(),
              results: z.string(),
            }),
          }),
          404: z.object({ message: z.string() }),
          500: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { customerId } = request.params

      const getLastDraftProposalUseCase = makeGetLastDraftProposal()

      try {
        const proposalDraft = await getLastDraftProposalUseCase.execute({
          customerId,
          userId: request.user.sub,
        })

        return reply.status(200).send(proposalDraft)
      } catch (error) {
        if (error instanceof ResourceNotFoundError) {
          return reply.status(404).send({ message: error.message })
        }

        return reply.status(500).send({ message: 'Internal Server Error' })
      }
    }
  )
}
