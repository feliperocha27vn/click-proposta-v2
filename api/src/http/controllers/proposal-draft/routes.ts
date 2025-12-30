import type { FastifyInstance } from 'fastify'
import { createProposalDraft } from './create-proposal-draft'
import { getLastDraftProposal } from './get-last-draft-proposal'

export function routesProposalDraft(app: FastifyInstance) {
  app.register(createProposalDraft)
  app.register(getLastDraftProposal)
}
