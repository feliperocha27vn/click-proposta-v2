export class NotFoundProposal extends Error {
  constructor() {
    super('No proposals found')
  }
}
