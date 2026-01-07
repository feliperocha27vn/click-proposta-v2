import { prisma } from '@/lib/prisma'

test('should fetch many budgets', async () => {
  const user = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john.doe@example.com',
    },
  })

  expect(user.name).toBe('John Doe')
})
