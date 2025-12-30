import type { Prisma, Proposal } from '@prisma/client'

export interface ServicesProposal {
  price: number
  servicesId: string
}

export interface ProposalMinimalDetails {
  id: string
  name: string
  title: string
  totalPrice: string
  status: 'DRAFT' | 'SENT' | 'APPROVED' | 'REJECTED'
}

export interface ProposalWithCustomer {
  id: string
  urlLogoImage: string | null
  title: string
  customersId: string
  welcomeDescription: string | null
  whyUs: string | null
  challenge: string | null
  solution: string | null
  results: string | null
  discount: number | null
  totalPrice: string | null
  userId: string
  customerName: string
  services: {
    price: string
    name: string
  }[]
}

export interface ProposalRepository {
  create(
    data: Prisma.ProposalUncheckedCreateInput,
    services: ServicesProposal[]
  ): Promise<Proposal>
  fetchProposalMinimalDetails(userId: string): Promise<ProposalMinimalDetails[]>
  getById(id: string): Promise<ProposalWithCustomer | null>
  update(
    id: string,
    userId: string,
    data: Prisma.ProposalUncheckedUpdateInput
  ): Promise<void>
  confirmSending(id: string, userId: string): Promise<void>
  approveProposal(id: string): Promise<void>
  recusedProposal(id: string): Promise<void>
}
