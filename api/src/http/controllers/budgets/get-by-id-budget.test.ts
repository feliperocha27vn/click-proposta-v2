import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { createUserAndAuthentication } from '@/utils/tests/createUserAndAuthentication'
import request from 'supertest'

describe('Get budget by id', () => {
  beforeEach(async () => {
    await app.ready()
  })

  afterEach(async () => {
    await app.close()
  })

  it('Deve ser capaz de buscar um orçamento por id', async () => {
    const { token, user } = await createUserAndAuthentication(app)

    const customer = await prisma.customers.create({
      data: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '123456789',
        userId: user.id,
      },
    })

    const budgetCreated = await prisma.budgets.create({
      data: {
        total: 100,
        status: 'DRAFT',
        usersId: user.id,
        customersId: customer.id,
      },
    })

    const reply = await request(app.server)
      .get(`/budgets/${budgetCreated.id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(reply.statusCode).toBe(200)
    expect(reply.body).toEqual({
      budget: expect.objectContaining({
        total: 100,
      }),
    })
  })
})
