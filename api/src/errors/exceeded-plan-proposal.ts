export class ExceededPlanProposal extends Error {
  constructor() {
    super('User has exceeded the number of proposals allowed by their plan.')
  }
}
