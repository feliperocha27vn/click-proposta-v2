import { makeUpdateServiceUseCase } from '@/factories/services/make-update-service-use-case'
import { verifyJwt } from '@/middlewares/verifyJwt'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'

export const update: FastifyPluginAsyncZod = async app => {
  app.put(
    '/services/:idService',
    {
      onRequest: [verifyJwt],
      schema: {
        operationId: 'updateService',
        tags: ['Services'],
        params: z.object({
          idService: z.uuid(),
        }),
        body: z.object({
          name: z.string().optional(),
          description: z.string().optional(),
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
      const { name, description } = request.body

      const updateServiceUseCase = makeUpdateServiceUseCase()

      try {
        await updateServiceUseCase.execute({
          userId: request.user.sub,
          serviceId: idService,
          name,
          description,
        })

        return reply.status(200).send({ statusCode: 200 })
      } catch (error) {
        console.error(error)
        reply.status(500).send({
          message: 'Internal server error',
          statusCode: 500,
        })
      }
    }
  )
}
