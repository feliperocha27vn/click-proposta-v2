export class DataPaymentIncompleteError extends Error {
  constructor() {
    super('Dados incompletos para pagamento')
  }
}
