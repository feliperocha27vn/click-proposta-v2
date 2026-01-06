export class NotFoundBudgets extends Error {
  constructor() {
    super('No budgets found')
  }
}
