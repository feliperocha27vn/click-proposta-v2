import { makeDeleteServiceUseCase } from '@/factories/services/make-delete-service-use-case'
import { verifyJwt } from '@/middlewares/verifyJwt'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'

export const deleteService: FastifyPluginAsyncZod = async app => {
  app.delete(
    '/services/:idService',
    {
      onRequest: [verifyJwt],
      schema: {
        operationId: 'deleteService',
        tags: ['Services'],
        params: z.object({
            idService: z.uuid(),
        }),
        response: {
          200: z.object({
            statusCode: z.number().default(200),
          }),
          500: z.object({
            message: z.string(),
            statusCode: z.number().default(500),
          }),
        },
      },
    },
    async (request, reply) => {
        const { idService } = request.params

      const deleteServiceUseCase = makeDeleteServiceUseCase()

      try {
        await deleteServiceUseCase.execute({
            userId: request.user.sub,
         serviceId: idService,
        })

        return reply.status(200).send({statusCode: 200})
      } catch (error) {
        console.error(error)
        reply.status(500).send({
          message: 'Internal server error',
          statusCode: 500
        })
      }
    }
  )
}
