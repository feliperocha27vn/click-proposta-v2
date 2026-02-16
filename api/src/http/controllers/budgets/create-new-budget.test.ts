import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { createUserAndAuthentication } from '@/utils/tests/createUserAndAuthentication'
import request from 'supertest'

describe('Create new budget (E2E)', () => {
  beforeEach(async () => {
    await app.ready()
  })

  afterEach(async () => {
    await app.close()
  })

  it('deve ser capaz de criar um novo orçamento com serviços contendo quantidade e preço', async () => {
    const { token, user } = await createUserAndAuthentication(app)

    const customer = await prisma.customers.create({
      data: {
        name: 'Cliente Teste',
        email: 'cliente@teste.com',
        phone: '11999999999',
        userId: user.id,
      },
    })

    const response = await request(app.server)
      .post('/budgets')
      .set('Authorization', `Bearer ${token}`)
      .send({
        customerId: customer.id,
        userId: user.id,
        total: 200,
        services: [
          {
            id: 'service-1',
            title: 'Camiseta',
            description: 'Camiseta de algodão',
            quantity: 10,
            price: 20,
          },
        ],
      })

    expect(response.statusCode).toEqual(201)

    const budgetOnDatabase = await prisma.budgets.findFirst({
      where: {
        customersId: customer.id,
      },
      include: {
        budgetsServices: true,
      },
    })

    expect(budgetOnDatabase).toBeTruthy()
    expect(budgetOnDatabase?.budgetsServices).toHaveLength(1)
    expect(budgetOnDatabase?.budgetsServices[0]).toEqual(
      expect.objectContaining({
        title: 'Camiseta',
        description: 'Camiseta de algodão',
        quantity: 10,
        price: expect.anything(), // Decimal handling might vary, checking existence
      })
    )
    // Check specific value for Decimal if possible, usually it returns as specific object or string in Prisma
    expect(Number(budgetOnDatabase?.budgetsServices[0].price)).toBe(20)
  })
})
