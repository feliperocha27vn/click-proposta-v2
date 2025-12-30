import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { makeGetCostumerByIdUseCase } from '@/factories/customers/make-get-by-id-costumer-use-case'
import { verifyJwt } from '@/middlewares/verifyJwt'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'

export const getById: FastifyPluginAsyncZod = async app => {
  app.get(
    '/customer/:customerId',
    {
      onRequest: [verifyJwt],
      schema: {
        tags: ['Customers'],
        operationId: 'getCustomerById',
        params: z.object({
          customerId: z.uuid('ID do cliente deve ser um UUID válido'),
        }),
        response: {
          200: z.object({
            customer: z.object({
              name: z.string(),
              email: z.email('Email deve ser válido'),
              phone: z.string().min(10).max(15),
              createdAt: z.date(),
              updatedAt: z.date(),
            }),
          }),
          404: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { customerId } = request.params

      const getCostumerByIdUseCase = makeGetCostumerByIdUseCase()

      try {
        const { customer } = await getCostumerByIdUseCase.execute({
          customerId,
        })

        return reply.status(200).send({ customer })
      } catch (err) {
        if (err instanceof ResourceNotFoundError) {
          return reply.status(404).send({
            message: err.message,
          })
        }
      }
    }
  )
}
