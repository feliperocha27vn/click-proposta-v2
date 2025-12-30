import { CpfNotIsValid } from '@/errors/cpf-not-is-valid'
import { makeCompleteRegisterUserUseCase } from '@/factories/users/make-complete-register-user-use-case'
import { verifyJwt } from '@/middlewares/verifyJwt'
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
        }),
        response: {
          204: z.void(),
          406: z.object({
            message: z.string(),
          }),
          500: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { phone, cpf } = request.body

      const completRegisterUserUseCase = makeCompleteRegisterUserUseCase()

      try {
        await completRegisterUserUseCase.execute({
          userId: request.user.sub,
          phone,
          cpf,
        })

        return reply.status(204).send()
      } catch (error) {
        if (error instanceof CpfNotIsValid) {
          return reply.status(406).send({ message: error.message })
        }

        return reply.status(500).send({ message: 'Internal server error.' })
      }
    }
  )
}
