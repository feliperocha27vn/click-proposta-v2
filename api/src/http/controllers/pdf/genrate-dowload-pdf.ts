import { makeGetDataForCreatePdfProductUseCase } from '@/factories/users/make-get-data-for-create-pdf-product-use-case'
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
      onRequest: async (request, reply) => {
        const authHeader = request.headers.authorization
        if (authHeader?.startsWith('Bearer ')) {
          const token = authHeader.split(' ')[1]
          if (token === process.env.BOT_SERVICE_TOKEN) {
            return // É o bot, pode passar!
          }
        }
        // Se não for o bot, verifica como usuário normal (JWT)
        return verifyJwt(request, reply)
      },
      schema: {
        tags: ['PDF'],
        body: z.object({
          userId: z.string().optional(),
          imgUrl: z.string().optional(),
          nameUser: z.string().optional(),
          nameCustomer: z.string().optional(),
          emailCustomer: z.string().optional(),
          phoneCustomer: z.string().optional(),
          total: z.string(),
          services: z.array(
            z.object({
              id: z.string().optional(),
              title: z.string(),
              description: z.string().optional(),
              quantity: z.number().nullable().optional(),
              price: z.number().nullable().optional(),
              budgetsId: z.string().nullable().optional(),
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
        userId,
      } = request.body

      try {
        const targetUserId = userId || request.user?.sub

        if (!targetUserId) {
          return reply.status(400).send({ message: 'User ID is required' })
        }

        // Recupera os dados do dono do bot se estiverem faltando no body
        let finalNameUser = nameUser
        let finalImgUrl = imgUrl
        let finalPhone = phoneCustomer
        let finalEmail = emailCustomer

        if (!nameUser || !imgUrl) {
          const getDataUseCase = makeGetDataForCreatePdfProductUseCase()
          const { user } = await getDataUseCase.execute({
            userId: targetUserId,
          })

          finalNameUser = user.phone
          finalPhone = user.phone
          finalEmail = user.email
          finalImgUrl = user.avatarUrl
        }

        const normalizedServices = services.map(s => ({
          ...s,
          id: s.id ?? Math.random().toString(),
          description: s.description ?? '',
          budgetsId: s.budgetsId ?? null,
        }))

        const pdfDocument = React.createElement(BudgetPdfDocument, {
          imgUrl: finalImgUrl || '',
          nameUser: finalNameUser || 'Usuário Click Proposta',
          nameCustomer: nameCustomer || 'Cliente',
          emailCustomer: finalEmail || '',
          phoneCustomer: finalPhone || '',
          total,
          services: normalizedServices,
          // biome-ignore lint/suspicious/noExplicitAny: necessário para compatibilidade com @react-pdf/renderer
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
