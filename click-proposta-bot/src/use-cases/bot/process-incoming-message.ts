import type { SessionRepository } from '../../repositories/session-repository'
import type { HandleAwaitingTypeUseCase } from './handle-awaiting-type'
import type { HandleCollectingItemsUseCase } from './handle-collecting-items'
import type { HandleConfirmingUseCase } from './handle-confirming'
import type { HandleNewUserUseCase } from './handle-new-user'

interface ProcessIncomingMessageUseCaseRequest {
  instanceName: string
  phone: string
  text: string
}

export class ProcessIncomingMessageUseCase {
  constructor(
    private sessionRepository: SessionRepository,
    private handleNewUser: HandleNewUserUseCase,
    private handleAwaitingType: HandleAwaitingTypeUseCase,
    private handleCollectingItems: HandleCollectingItemsUseCase,
    private handleConfirming: HandleConfirmingUseCase
  ) {}

  async execute({
    instanceName,
    phone,
    text,
  }: ProcessIncomingMessageUseCaseRequest): Promise<string | null> {
    // 1. Traz a sessão do usuário do Redis
    const session = await this.sessionRepository.getSession(phone)

    // 2. Se não tem sessão ativa, é usuário novo iniciando a conversa
    if (!session) {
      return this.handleNewUser.execute({ phone })
    }

    // 3. O switch/case é o coração da máquina de estados
    switch (session.state) {
      case 'AWAITING_TYPE':
        return this.handleAwaitingType.execute({ phone, text })

      case 'COLLECTING_ITEMS':
        return this.handleCollectingItems.execute({ session, phone, text })

      case 'CONFIRMING':
        return this.handleConfirming.execute({
          instanceName,
          session,
          phone,
          text,
        })

      default:
        // Se o estado for inválido ou deu erro, reseta a sessão por segurança
        await this.sessionRepository.clearSession(phone)
        return '⚠️ Algo deu errado. Reiniciamos sua sessão.\n\nPara começar, envie *Oi*.'
    }
  }
}
