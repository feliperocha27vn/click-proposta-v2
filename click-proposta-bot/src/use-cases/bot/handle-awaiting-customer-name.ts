import type { SessionRepository } from '../../repositories/session-repository'

interface HandleAwaitingCustomerNameUseCaseRequest {
  phone: string
  text: string
}

export class HandleAwaitingCustomerNameUseCase {
  constructor(private sessionRepository: SessionRepository) {}

  async execute({
    phone,
    text,
  }: HandleAwaitingCustomerNameUseCaseRequest): Promise<string> {
    const customerName = text.trim()

    await this.sessionRepository.saveSession(phone, {
      state: 'COLLECTING_ITEMS',
      customerName,
    })

    return '✅ Maravilha! Agora me envie os serviços do orçamento.\n\nPara o serviço civil, você pode ser bem detalhista na descrição dos serviços.\n\nExemplo:\n_Instalação de um (01) painel de distribuição de energia (QD) de sobrepor 120x80x20cm, barramento principal até 200A, e secundários até 63A. Incluso ligações elétricas..._\n\nOu envie um áudio com as descrições.\n\nQuando terminar de enviar todos os serviços, envie *1*.'
  }
}
