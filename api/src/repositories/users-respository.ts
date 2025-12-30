import type { Customers, Prisma, User } from '@prisma/client'

interface UserForPaymentData {
  name: string | null
  email: string | null
  phone: string | null
  cpf: string | null
}

export interface GetUserById {
  email: string
  name: string | null
  avatarUrl: string | null
  plan: 'FREE' | 'PRO'
  isRegisterComplete: boolean
}

export interface UsersRepository {
  createNewCostumer(
    data: Prisma.CustomersUncheckedCreateInput
  ): Promise<Customers>
  getById(userId: string): Promise<GetUserById | null>
  fetchCustomers(userId: string): Promise<Customers[] | null>
  searchByNameAndEmail(
    search: string,
    userId: string
  ): Promise<Customers[] | null>
  countProposals(userId: string): Promise<number>
  completeRegister(userId: string, data: Prisma.UserUpdateInput): Promise<User>
  getCompleteRegister(userId: string): Promise<Partial<User> | null>
  getDataForPayment(userId: string): Promise<UserForPaymentData | null>
  changePlan(userId: string): Promise<void>
}
