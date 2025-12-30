import { ExceededPlanProposal } from '@/errors/exceeded-plan-proposal'
import { NotFoundProposal } from '@/errors/not-found-proposals'
import { makeCreateProposalUseCase } from '@/factories/proposal/make-create-proposal-use-case'
import { verifyJwt } from '@/middlewares/verifyJwt'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'

export const create: FastifyPluginAsyncZod = async app => {
  app.post(
    '/proposal',
    {
      onRequest: [verifyJwt],
      schema: {
        tags: ['Proposals'],
        operationId: 'createProposal',
        body: z.object({
          urlLogoImage: z.url('URL da imagem deve ser válida').nullable(),
          title: z
            .string()
            .min(1, 'Título é obrigatório')
            .max(255, 'Título deve ter no máximo 255 caracteres'),
          customersId: z.uuid('ID do cliente deve ser um UUID válido'),
          welcomeDescription: z
            .string()
            .min(1, 'Descrição de boas-vindas é obrigatória'),
          whyUs: z.string().min(1, 'Campo "Por que nós" é obrigatório'),
          challenge: z.string().min(1, 'Desafio é obrigatório'),
          solution: z.string().min(1, 'Solução é obrigatória'),
          services: z
            .array(
              z.object({
                price: z.coerce.number().positive('Preço deve ser positivo'),
                servicesId: z.uuid('ID do serviço deve ser um UUID válido'),
              })
            )
            .min(1, 'Pelo menos um serviço deve ser informado'),
          results: z.string().min(1, 'Resultados são obrigatórios'),
          discount: z
            .number()
            .min(0, 'Desconto não pode ser negativo')
            .max(100, 'Desconto não pode ser maior que 100%'),
        }),
      },
    },
    async (request, reply) => {
      const {
        urlLogoImage,
        title,
        customersId,
        welcomeDescription,
        whyUs,
        challenge,
        solution,
        services,
        results,
        discount,
      } = request.body

      try {
        const createProposalUseCase = makeCreateProposalUseCase()

        const { proposal } = await createProposalUseCase.execute({
          urlLogoImage,
          title,
          customersId,
          welcomeDescription,
          whyUs,
          challenge,
          solution,
          services,
          results,
          discount,
          userId: request.user.sub,
        })

        return reply.status(201).send({
          proposal,
        })
      } catch (error) {
        if (error instanceof NotFoundProposal) {
          return reply.status(404).send({
            message: 'Usuário não encontrado',
          })
        }

        if (error instanceof ExceededPlanProposal) {
          return reply.status(403).send({
            message: 'Limite de propostas do plano excedido',
          })
        }

        throw error
      }
    }
  )
}
