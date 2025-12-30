import { makeConfirmSendingProposalUseCase } from '@/factories/proposal/make-confirm-sending-proposal-use-case'
import { verifyJwt } from '@/middlewares/verifyJwt'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'

export const confirmSending: FastifyPluginAsyncZod = async app => {
  app.patch(
    '/proposal/confirm-sending/:proposalId',
    {
      onRequest: [verifyJwt],
      schema: {
        tags: ['Proposals'],
        operationId: 'confirmSendingProposal',
        params: z.object({
          proposalId: z.uuid(),
        }),
        response: {
          204: z.object({ statusCode: z.number().default(204) }),
          500: z.object({ error: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { proposalId } = request.params

      const confirmSendingProposalUseCase = makeConfirmSendingProposalUseCase()

      try {
        await confirmSendingProposalUseCase.execute({
          proposalId,
          userId: request.user.sub,
        })

        return reply.status(204).send({ statusCode: 204 })
      } catch (error) {
        console.error('Error confirming proposal sending:', error)
        reply.status(500).send({ error: 'Internal Server Error' })
      }
    }
  )
}
