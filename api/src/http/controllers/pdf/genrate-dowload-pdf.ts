import { verifyJwt } from '@/middlewares/verifyJwt'
import { BudgetPdfDocument } from '@/pdf/templates/budget-pdf-document'
import { renderToStream } from '@react-pdf/renderer'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import React from 'react'
import z from 'zod'

export const generatePdfDocument: FastifyPluginAsyncZod = async app => {
  app.post(
    '/pdf/generate',
    {
      onRequest: [verifyJwt],
      schema: {
        tags: ['PDF'],
        body: z.object({
          imgUrl: z.string(),
          nameUser: z.string(),
          nameCustomer: z.string(),
          emailCustomer: z.string(),
          phoneCustomer: z.string(),
          total: z.string(),
          services: z.array(
            z.object({
              id: z.string(),
              name: z.string(),
              description: z.string(),
            })
          ),
        }),
      },
    },
    async (request, reply) => {
      const {
        imgUrl,
        nameUser,
        nameCustomer,
        emailCustomer,
        phoneCustomer,
        total,
        services,
      } = request.body

      try {
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
          'attachment; filename="proposta.pdf"'
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
