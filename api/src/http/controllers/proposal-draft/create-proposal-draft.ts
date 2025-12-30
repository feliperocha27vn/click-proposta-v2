import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { makeCreateProposalDraftUseCase } from '@/factories/proposal/make-create-proposal-draft'
import { verifyJwt } from '@/middlewares/verifyJwt'
import { generateProposalTexts } from '@/utils/gemini/chat'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'

export const createProposalDraft: FastifyPluginAsyncZod = async app => {
  app.post(
    '/draft-proposals/:customerId',
    {
      onRequest: [verifyJwt],
      schema: {
        tags: ['DraftProposals'],
        operationId: 'createProposalDraft',
        params: z.object({
          customerId: z.uuid(),
        }),
        body: z.object({
          userPrompt: z.string().min(10).max(5000),
        }),
        response: {
          201: z.void(),
          404: z.object({ message: z.string() }),
          500: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { customerId } = request.params
      const { userPrompt } = request.body

      const createProposalDraftUseCase = makeCreateProposalDraftUseCase()

      try {
        const {
          title,
          challenge,
          results,
          solution,
          welcomeDescription,
          whyUs,
        } = await generateProposalTexts(userPrompt)

        await createProposalDraftUseCase.execute({
          userId: request.user.sub,
          customerId,
          title,
          welcomeDescription,
          whyUs,
          challenge,
          solution,
          results,
          userPrompt,
        })
      } catch (error) {
        if (error instanceof ResourceNotFoundError) {
          return reply.status(404).send({ message: error.message })
        }

        return reply.status(500).send({ message: 'Internal server error.' })
      }
    }
  )
}
