import { makeCreateNewCustomerUseCase } from '@/factories/users/make-create-new-customer-use-case'
import { verifyJwt } from '@/middlewares/verifyJwt'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'

export const createNewCostumer: FastifyPluginAsyncZod = async app => {
  app.post(
    '/user/customer/create',
    {
      onRequest: [verifyJwt],
      schema: {
        operationId: 'createNewCustomer',
        tags: ['Customers'],
        body: z.object({
          name: z.string().min(2).max(100),
          email: z.email(),
          phone: z.coerce.string().min(10).max(12).regex(/^\d+$/),
        }),
        response: {
          201: z.object({
            message: z.string(),
            statusCode: z.number().default(201),
          }),
          400: z.object({
            message: z.string(),
            statusCode: z.number().default(400),
          }),
        },
      },
    },
    async (request, reply) => {
      const { name, email, phone } = request.body

      const createNewCostumerUseCase = makeCreateNewCustomerUseCase()

      try {
        await createNewCostumerUseCase.execute({
          userId: request.user.sub,
          name,
          email,
          phone: phone.toString(),
        })

        reply.status(201).send({
          message: 'Customer created successfully',
          statusCode: 201,
        })
      } catch (error) {
        console.error(error)
        reply.status(400).send({
          message: error instanceof Error ? error.message : 'Bad request',
          statusCode: 400,
        })
      }
    }
  )
}
