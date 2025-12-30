import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { makeFetchCustomersUseCase } from '@/factories/users/make-fetch-customers-use-case'
import { verifyJwt } from '@/middlewares/verifyJwt'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'

export const fetchCustomers: FastifyPluginAsyncZod = async app => {
  app.get(
    '/user/customers',
    {
      onRequest: [verifyJwt],
      schema: {
        operationId: 'fetchCustomers',
        tags: ['Customers'],
        response: {
          200: z.object({
            customers: z.array(
              z.object({
                name: z.string(),
                id: z.string(),
                email: z.string(),
                phone: z.string(),
              })
            ),
            statusCode: z.number().default(200),
          }),
          404: z.object({
            message: z.string(),
            statusCode: z.number().default(404),
          }),
        },
      },
    },
    async (request, reply) => {
      const fetchCustomersUseCase = makeFetchCustomersUseCase()

      try {
        const { customers } = await fetchCustomersUseCase.execute({
          userId: request.user.sub,
        })

        reply.send({ 
          customers,
          statusCode: 200
        })
      } catch (error) {
        const message =
          error instanceof ResourceNotFoundError
            ? error.message
            : 'Internal Server Error'
        reply.status(404).send({ 
          message,
          statusCode: 404
        })
      }
    }
  )
}
