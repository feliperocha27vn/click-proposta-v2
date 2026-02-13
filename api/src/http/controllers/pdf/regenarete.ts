import { makeGetInfoForRegenaretePdfUseCase } from '@/factories/budgets/make-get-info-for-regenarete-pdf-use-case'
import { verifyJwt } from '@/middlewares/verifyJwt'
import { BudgetPdfDocument } from '@/pdf/templates/budget-pdf-document'
import { renderToStream } from '@react-pdf/renderer'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import React from 'react'
import z from 'zod'

export const regenaretePdfDocument: FastifyPluginAsyncZod = async app => {
  app.get(
    '/pdf/regenerate/:budgetId',
    {
      onRequest: [verifyJwt],
      schema: {
        operationId: 'regeneratePdfDocument',
        params: z.object({
          budgetId: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const { budgetId } = request.params

      const getInfoForRegenaretePdfUseCase =
        makeGetInfoForRegenaretePdfUseCase()

      try {
        const {
          imgUrl,
          nameUser,
          nameCustomer,
          emailCustomer,
          phoneCustomer,
          total,
          services,
        } = await getInfoForRegenaretePdfUseCase.execute({
          budgetId,
          usersId: request.user.sub,
        })

        const pdfDocument = React.createElement(BudgetPdfDocument, {
          imgUrl,
          nameUser,
          nameCustomer,
          emailCustomer,
          phoneCustomer,
          total,
          services,
        }) as React.ReactElement<any>

        const stream = await renderToStream(pdfDocument)

        reply.header('Content-Type', 'application/pdf')
        reply.header(
          'Content-Disposition',
          `attachment; filename="${nameCustomer}.pdf"`
        )

        return reply.send(stream)
      } catch (error) {
        console.error('Erro ao gerar PDF:', error)
        reply.status(500).send({
          error: 'Erro ao gerar PDF',
          message: error instanceof Error ? error.message : 'Erro desconhecido',
        })
      }
    }
  )
}
