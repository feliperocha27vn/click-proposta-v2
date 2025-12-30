import { makeGetByIdProposalUseCase } from '@/factories/proposal/make-get-by-id-proposal-use-case'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod/v4'

export const getById: FastifyPluginAsyncZod = async app => {
  app.get(
    '/proposal/:id',
    {
      schema: {
        tags: ['Proposals'],
        operationId: 'getProposalById',
        params: z.object({
          id: z.uuid('ID deve ser um UUID válido'),
        }),
        response: {
          200: z.object({
            id: z.uuid(),
            title: z.string(),
            urlLogoImage: z.string().nullable(),
            customersId: z.string(),
            welcomeDescription: z.string().nullable(),
            whyUs: z.string().nullable(),
            challenge: z.string().nullable(),
            solution: z.string().nullable(),
            results: z.string().nullable(),
            discount: z.number().nullable(),
            totalPrice: z.string().nullable(),
            userId: z.string(),
            customerName: z.string(),
            services: z.array(
              z.object({
                price: z.string(),
                name: z.string(),
              })
            ),
          }),
          500: z.object({ error: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params

      const getProposalByIdUseCase = makeGetByIdProposalUseCase()

      try {
        const { proposal } = await getProposalByIdUseCase.execute({ id })

        return reply.status(200).send(proposal)
      } catch (error) {
        return reply.status(500).send({
          error:
            error instanceof Error ? error.message : 'Internal server error.',
        })
      }
    }
  )
}
