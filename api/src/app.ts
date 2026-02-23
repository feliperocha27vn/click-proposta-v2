import fastifyCors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import fastifySwagger from '@fastify/swagger'
import ScalarApiReference from '@scalar/fastify-api-reference'
import fastify from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import { env } from './env'
import { routesBudgets } from './http/controllers/budgets/routes'
import { routesCustomer } from './http/controllers/customer/routes'
import { routesPayments } from './http/controllers/payments/routes'
import { generatePdfProduct } from './http/controllers/pdf/generate-pdf-product'
import { generatePdfDocument } from './http/controllers/pdf/genrate-dowload-pdf'
import { regenaretePdfDocument } from './http/controllers/pdf/regenarete'
import { routesProposalDraft } from './http/controllers/proposal-draft/routes'
import { routesProposal } from './http/controllers/proposal/routes'
import { routesService } from './http/controllers/services/routes'
import { usersRoutes } from './http/controllers/users/routes'

export const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.register(fastifyCors, {
  origin: ['http://localhost:5173', 'https://click-proposta.umdoce.dev.br'],
  methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH', 'OPTIONS'],
  credentials: true,
})

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'API documentation for the Click Proposta v1.0.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  transform: jsonSchemaTransform,
})

app.register(ScalarApiReference, {
  routePrefix: '/docs',
})

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})

// Health check endpoint
app.get('/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() }
})

app.register(usersRoutes)
app.register(routesService)
app.register(routesProposal)
app.register(routesCustomer)
app.register(routesPayments)
app.register(routesProposalDraft)
app.register(generatePdfDocument)
app.register(generatePdfProduct)
app.register(regenaretePdfDocument)
app.register(routesBudgets)
