import { NotFoundProposal } from '@/errors/not-found-proposals'
import { makeRecusedProposalUseCase } from '@/factories/proposal/make-recused-proposal-use-case'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'

export const recuseProposal: FastifyPluginAsyncZod = async app => {
  app.patch(
    '/proposals/:id/recuse',
    {
      schema: {
        operationId: 'recuseProposal',
        tags: ['Proposals'],
        params: z.object({
          id: z.uuid(),
        }),
        response: {
          204: z.object({ message: z.string() }).optional(),
          404: z.object({ message: z.string() }),
          500: z.object({ message: z.string() }).optional(),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params

      const recusedProposalUseCase = makeRecusedProposalUseCase()

      try {
        await recusedProposalUseCase.execute({ proposalId: id })
        return reply.status(204).send()
      } catch (error) {
        if (error instanceof NotFoundProposal) {
          return reply.status(404).send({ message: error.message })
        }

        return reply.status(500).send({ message: 'Internal server error.' })
      }
    }
  )
}
