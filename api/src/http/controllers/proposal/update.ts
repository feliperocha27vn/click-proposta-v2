import { makeUpdateProposalUseCase } from '@/factories/proposal/make-update-proposal-use-case'
import { verifyJwt } from '@/middlewares/verifyJwt'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'

export const update: FastifyPluginAsyncZod = async app => {
  app.patch(
    '/proposal/:proposalId',
    {
      onRequest: [verifyJwt],
      schema: {
        operationId: 'updateProposal',
        tags: ['Proposals'],
        params: z.object({
          proposalId: z.uuid(),
        }),
        body: z.object({
          title: z.string().optional(),
          welcomeDescription: z.string().nullable().optional(),
          whyUs: z.string().nullable().optional(),
          challenge: z.string().nullable().optional(),
          solution: z.string().nullable().optional(),
          results: z.string().nullable().optional(),
          discount: z.number().optional(),
          totalPrice: z.number().optional(),
        }),
        response: {
          204: z.void(),
          400: z.object({
            message: z.string(),
          }),
          500: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      try {
        console.log('=== UPDATE PROPOSAL START ===')
        const { proposalId } = request.params
        const updateData = request.body
        const userId = request.user.sub

        console.log('Proposal ID:', proposalId)
        console.log('User ID:', userId)
        console.log('Update data:', JSON.stringify(updateData, null, 2))

        console.log('Creating use case...')
        const updateProposalUseCase = makeUpdateProposalUseCase()
        console.log('Use case created successfully')

        console.log('Executing use case...')
        const result = await updateProposalUseCase.execute({
          id: proposalId,
          userId,
          ...updateData,
        })
        console.log('Use case executed successfully:', result)

        console.log('=== UPDATE PROPOSAL SUCCESS ===')
        return reply.status(204).send()
      } catch (error) {
        console.error('=== UPDATE PROPOSAL ERROR ===')
        console.error('Error type:', typeof error)
        console.error('Error constructor:', error?.constructor?.name)
        console.error('Error details:', error)

        if (error instanceof Error) {
          console.error('Error message:', error.message)
          console.error('Error stack:', error.stack)
        }

        // Se for um erro do Prisma, vamos logar mais detalhes
        if (error && typeof error === 'object' && 'code' in error) {
          console.error('Database error code:', (error as any).code)
          console.error('Database error meta:', (error as any).meta)
        }

        console.error('=== UPDATE PROPOSAL ERROR END ===')

        return reply.status(500).send({
          message: 'Internal server error',
          ...(process.env.NODE_ENV === 'development' && {
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
          }),
        })
      }
    }
  )
}
