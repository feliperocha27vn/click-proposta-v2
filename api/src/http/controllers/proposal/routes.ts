import type { FastifyInstance } from 'fastify'
import { approveProposal } from './approve-proposal'
import { confirmSending } from './confirm-sending'
import { countTotalAndAcceptedProposalsController } from './count-total-and-accepted-proposals'
import { create } from './create'
import { fetchMinimalDetailsProposal } from './fetch-minimal-details-propsal'
import { getProposalAndBudgetStatsController } from './get-proposal-and-budget-stats'
import { getById } from './get-by-id'
import { recuseProposal } from './recused-proposal'
import { update } from './update'

export function routesProposal(app: FastifyInstance) {
  app.register(create)
  app.register(fetchMinimalDetailsProposal)
  app.register(getById)
  app.register(update)
  app.register(confirmSending)
  app.register(approveProposal)
  app.register(recuseProposal)
  app.register(countTotalAndAcceptedProposalsController)
  app.register(getProposalAndBudgetStatsController)
}
