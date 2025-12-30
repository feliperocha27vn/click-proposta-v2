import { env } from '@/env'
import { makeCreatePaymentUseCase } from '@/factories/payments/make-create-payment-use-case'
import { abacatePay } from '@/lib/abacate-pay'
import { verifyJwt } from '@/middlewares/verifyJwt'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'

export const createNewPayment: FastifyPluginAsyncZod = async app => {
  app.post(
    '/payment',
    {
      onRequest: [verifyJwt],
      schema: {
        tags: ['Payments'],
        operationId: 'createNewPayment',
        body: z.object({
          price: z.number().default(2499),
          quantity: z.number().default(1),
          customer: z.object({
            name: z.string().min(3),
            email: z.email(),
            cellphone: z.string().min(10).max(11),
            cpf: z.string().min(11).max(14),
          }),
        }),
        response: {
          201: z.url(),
          500: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { price, quantity, customer } = request.body

      const billing = await abacatePay.billing.create({
        frequency: 'ONE_TIME',
        methods: ['PIX'],
        products: [
          {
            externalId: 'pro-plan',
            name: 'Pro Plan',
            quantity,
            price,
          },
        ],
        returnUrl: env.ABACATE_RETURN_URL,
        completionUrl: env.ABACATE_COMPLETATION_URL,
        customer: {
          name: customer.name,
          email: customer.email,
          taxId: customer.cpf,
          cellphone: customer.cellphone,
        },
      })

      if (billing.error) {
        console.log('Error creating billing:', billing.error)
        return reply.status(500).send({ message: 'Error creating billing' })
      }

      const createPaymentUseCase = makeCreatePaymentUseCase()

      await createPaymentUseCase.execute({
        userId: request.user.sub,
        abacatePayId: billing.data?.id as string,
      })

      return reply.status(201).send(billing.data?.url)
    }
  )
}
