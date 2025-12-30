import { DataPaymentIncompleteError } from '@/errors/data-payment-incomplete'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { makeGetDataForPaymentUseCase } from '@/factories/users/make-get-data-for-payment-use-case'
import { verifyJwt } from '@/middlewares/verifyJwt'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'

export const getDataForPayment: FastifyPluginAsyncZod = async app => {
  app.get(
    '/data-for-payment',
    {
      onRequest: [verifyJwt],
      schema: {
        tags: ['Users'],
        operationId: 'getDataForPayment',
        response: {
          200: z.object({
            name: z.string(),
            email: z.string(),
            phone: z.string(),
            cpf: z.string(),
          }),
          422: z.object({
            message: z.string(),
          }),
          404: z.object({
            message: z.string(),
          }),
          500: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const getDataForPaymentUseCase = makeGetDataForPaymentUseCase()

      try {
        const userDataPayment = await getDataForPaymentUseCase.execute({
          userId: request.user.sub,
        })

        return reply.status(200).send(userDataPayment)
      } catch (error) {
        if (error instanceof ResourceNotFoundError) {
          return reply.status(404).send({ message: error.message })
        }

        if (error instanceof DataPaymentIncompleteError) {
          return reply.status(422).send({ message: error.message })
        }

        return reply.status(500).send({ message: 'Internal server error' })
      }
    }
  )
}
