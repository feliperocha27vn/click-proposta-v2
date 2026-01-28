import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { createUserAndAuthentication } from '@/utils/tests/createUserAndAuthentication'
import request from 'supertest'

describe('Fetch many budgets', () => {
  beforeEach(async () => {
    await app.ready()
  })

  afterEach(async () => {
    await app.close()
  })

  it('Deve ser capaz de buscar muitos orçamentos', async () => {
    const { token, user } = await createUserAndAuthentication(app)

    const customer = await prisma.customers.create({
      data: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '123456789',
        userId: user.id,
      },
    })

    await prisma.budgets.create({
      data: {
        total: 100,
        status: 'DRAFT',
        usersId: user.id,
        customersId: customer.id,
      },
    })

    const reply = await request(app.server)
      .get('/budgets')
      .set('Authorization', `Bearer ${token}`)

    expect(reply.statusCode).toBe(200)
    expect(reply.body.budgets).toHaveLength(1)
    expect(reply.body).toEqual({
      budgets: expect.arrayContaining([
        expect.objectContaining({
          total: 100,
        }),
      ]),
    })
  })
})
