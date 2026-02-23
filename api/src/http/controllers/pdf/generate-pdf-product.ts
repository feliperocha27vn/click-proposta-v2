import { makeGetDataForCreatePdfProductUseCase } from '@/factories/users/make-get-data-for-create-pdf-product-use-case'
import { verifyJwt } from '@/middlewares/verifyJwt'
import { BudgetPdfProducts } from '@/pdf/templates/budget-pdf-products'
import { renderToStream } from '@react-pdf/renderer'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import React from 'react'
import z from 'zod'

export const generatePdfProduct: FastifyPluginAsyncZod = async app => {
  app.post(
    '/pdf/generate-product',
    {
      onRequest: [verifyJwt],
      schema: {
        tags: ['PDF'],
        operationId: 'generatePdfProduct',
        body: z.object({
          total: z.string(),
          services: z.array(
            z.object({
              id: z.string(),
              title: z.string(),
              description: z.string(),
              quantity: z.number().nullable().optional(),
              price: z.number().nullable().optional(),
              budgetsId: z.string().nullable(),
            })
          ),
        }),
      },
    },
    async (request, reply) => {
      const { total, services } = request.body

      try {
        const getDataUseCase = makeGetDataForCreatePdfProductUseCase()
        const { user } = await getDataUseCase.execute({
          userId: request.user.sub,
        })

        const pdfDocument = React.createElement(BudgetPdfProducts, {
          phone: user.phone,
          email: user.email,
          cnpj: user.cnpj,
          imgUrl: user.avatarUrl,
          total,
          services,
          // biome-ignore lint/suspicious/noExplicitAny: necessário para compatibilidade com @react-pdf/renderer
        }) as React.ReactElement<any>

        const stream = await renderToStream(pdfDocument)

        reply.header('Content-Type', 'application/pdf')
        reply.header(
          'Content-Disposition',
          'attachment; filename="orcamento-produtos.pdf"'
        )

        return reply.send(stream)
      } catch (error) {
        console.error('Erro ao gerar PDF de produtos:', error)
        reply.status(500).send({
          error: 'Erro ao gerar PDF',
          message: error instanceof Error ? error.message : 'Erro desconhecido',
        })
      }
    }
  )
}
