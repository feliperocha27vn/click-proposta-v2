import { CpfNotIsValid } from '@/errors/cpf-not-is-valid'
import { makeCompleteRegisterUserUseCase } from '@/factories/users/make-complete-register-user-use-case'
import { verifyJwt } from '@/middlewares/verifyJwt'
import { Prisma } from '@prisma/client'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'

export const completeRegister: FastifyPluginAsyncZod = async app => {
  app.patch(
    '/complete-register',
    {
      onRequest: [verifyJwt],
      schema: {
        tags: ['Users'],
        operationId: 'completeRegister',
        body: z.object({
          phone: z.string().min(10).max(11),
          cpf: z.string().min(11).max(11),
          cnpj: z.string().min(14).max(18).optional(),
          street: z.string(),
          number: z.string(),
          neighborhood: z.string(),
          city: z.string(),
        }),
        response: {
          204: z.void(),
          406: z.object({
            message: z.string(),
          }),
          409: z.object({
            message: z.string(),
          }),
          500: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { phone, cpf, cnpj, street, number, neighborhood, city } =
        request.body

      const completRegisterUserUseCase = makeCompleteRegisterUserUseCase()

      try {
        await completRegisterUserUseCase.execute({
          userId: request.user.sub,
          phone,
          cpf,
          cnpj,
          street,
          number,
          neighborhood,
          city,
        })

        return reply.status(204).send()
      } catch (error) {
        console.error('Erro em /complete-register:', error)

        if (error instanceof CpfNotIsValid) {
          return reply.status(406).send({ message: error.message })
        }

        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === 'P2002'
        ) {
          return reply.status(409).send({ message: 'CPF já cadastrado.' })
        }

        return reply.status(500).send({ message: 'Internal server error.' })
      }
    }
  )
}
