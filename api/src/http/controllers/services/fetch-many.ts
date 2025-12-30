import { makeFetchManyServicesUseCase } from '@/factories/services/make-fetch-many-services-use-case'
import { verifyJwt } from '@/middlewares/verifyJwt'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'

export const fetchMany: FastifyPluginAsyncZod = async app => {
  app.get(
    '/services',
    {
      onRequest: [verifyJwt],
      schema: {
        operationId: 'fetchManyServices',
        tags: ['Services'],
        response: {
          200: z.object({
            services: z.array(
              z.object({
                id: z.string(),
                name: z.string(),
                description: z.string().nullable(),
              })
            ),
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
      const fetchManyServicesUseCase = makeFetchManyServicesUseCase()

      try {
        const { services } = await fetchManyServicesUseCase.execute({
          userId: request.user.sub,
        })

        return reply.status(200).send({ 
          services,
          statusCode: 200
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
