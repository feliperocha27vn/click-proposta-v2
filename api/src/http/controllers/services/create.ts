import { makeCreateServiceUseCase } from '@/factories/services/make-create-service-use-case'
import { verifyJwt } from '@/middlewares/verifyJwt'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'

export const create: FastifyPluginAsyncZod = async app => {
  app.post(
    '/service',
    {
      onRequest: [verifyJwt],
      schema: {
        operationId: 'createService',
        tags: ['Services'],
        body: z.object({
          name: z.string(),
          description: z.string().optional(),
        }),
        response: {
          201: z.object({
            message: z.string(),
            statusCode: z.number().default(201),
          }),
          500: z.object({
            message: z.string(),
            statusCode: z.number().default(500),
          }),
        },
      },
    },
    async (request, reply) => {
      const { name, description } = request.body

      const createServiceUseCase = makeCreateServiceUseCase()

      try {
        await createServiceUseCase.execute({
          name,
          description,
          userId: request.user.sub,
        })

        reply.status(201).send({ 
          message: 'Service created successfully',
          statusCode: 201
        })
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
