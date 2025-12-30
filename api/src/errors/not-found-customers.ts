export class NotFoundCustomersError extends Error {
  constructor() {
    super('No customers found')
  }
}
