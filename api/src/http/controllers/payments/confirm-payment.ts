import { env } from '@/env'
import { makeGetByIdBillingPaymentUseCase } from '@/factories/payments/make-get-by-id-billing-payment-use-case'
import { makeChangePlanUserUseCase } from '@/factories/users/make-change-plan-user-use-case'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'

export const confirmPayment: FastifyPluginAsyncZod = async app => {
  app.post(
    '/confirm-payment',
    {
      schema: {
        tags: ['Payments'],
        operationId: 'confirmPayment',
        querystring: z.object({
          webhookSecret: z.string(),
        }),
        body: z.object({
          data: z.object({
            billing: z.object({
              amount: z.number(),
              couponsUsed: z.array(z.unknown()),
              customer: z.object({
                id: z.string(),
                metadata: z.object({
                  cellphone: z.string(),
                  email: z.string(),
                  name: z.string(),
                  taxId: z.string(),
                }),
              }),
              frequency: z.string(),
              id: z.string(),
              kind: z.array(z.string()),
              paidAmount: z.number(),
              products: z.array(
                z.object({
                  externalId: z.string(),
                  id: z.string(),
                  quantity: z.number(),
                })
              ),
              status: z.string(),
            }),
            payment: z.object({
              amount: z.number(),
              fee: z.number(),
              method: z.string(),
            }),
          }),
          devMode: z.boolean(),
          event: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const { webhookSecret } = request.query

      if (webhookSecret !== env.ABACATE_WEBHOOK_KEY) {
        console.log('Invalid webhook secret')
        return reply.status(401).send({ message: 'Unauthorized' })
      }

      const { data } = request.body

      if (data.billing.status !== 'PAID') {
        console.log('Billing not paid:', data.billing.status)
        return reply.status(400).send({ message: 'Billing not paid' })
      }

      console.log('Payment confirmed for billing ID:', data.billing.id)

      const getByIdBillingPaymentUseCase = makeGetByIdBillingPaymentUseCase()

      const { payment } = await getByIdBillingPaymentUseCase.execute({
        billingId: data.billing.id,
      })

      const changePlanUseCase = makeChangePlanUserUseCase()

      console.log('About to change plan for user:', payment.userId)

      await changePlanUseCase.execute({
        userId: payment.userId,
      })

      console.log('Plan change completed for user:', payment.userId)

      return reply.status(200).send({ message: 'Payment confirmed' })
    }
  )
}
