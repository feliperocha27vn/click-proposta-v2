import { makeApproveProposalUseCase } from '@/factories/proposal/make-approve-proposal-use-case'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'

export const approveProposal: FastifyPluginAsyncZod = async app => {
  app.patch(
    '/proposal/approve-proposal/:proposalId',
    {
      schema: {
        tags: ['Proposals'],
        operationId: 'approveProposal',
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

      const approveProposal = makeApproveProposalUseCase()

      try {
        await approveProposal.execute({ proposalId })
        reply.status(204).send({ statusCode: 204 })
      } catch (error) {
        console.error('Error approving proposal:', error)
        reply.status(500).send({ error: 'Internal Server Error' })
      }
    }
  )
}
