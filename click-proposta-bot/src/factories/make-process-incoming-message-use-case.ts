import { GeminiAiProvider } from '../providers/ai/gemini-ai-provider'
import { EvolutionMessagingProvider } from '../providers/messaging/messaging-provider'
import { SessionRepository } from '../repositories/session-repository'
import { HandleAwaitingCustomerNameUseCase } from '../use-cases/bot/handle-awaiting-customer-name'
import { HandleAwaitingTotalValueUseCase } from '../use-cases/bot/handle-awaiting-total-value'
import { HandleAwaitingTypeUseCase } from '../use-cases/bot/handle-awaiting-type'
import { HandleCollectingItemsUseCase } from '../use-cases/bot/handle-collecting-items'
import { HandleConfirmingUseCase } from '../use-cases/bot/handle-confirming'
import { HandleNewUserUseCase } from '../use-cases/bot/handle-new-user'
import { ProcessIncomingMessageUseCase } from '../use-cases/bot/process-incoming-message'

export function makeProcessIncomingMessageUseCase() {
  const sessionRepository = new SessionRepository()
  const aiProvider = new GeminiAiProvider()
  const messagingProvider = new EvolutionMessagingProvider()

  const handleNewUser = new HandleNewUserUseCase(sessionRepository)
  const handleAwaitingType = new HandleAwaitingTypeUseCase(sessionRepository)
  const handleAwaitingCustomerName = new HandleAwaitingCustomerNameUseCase(
    sessionRepository
  )
  const handleAwaitingTotalValue = new HandleAwaitingTotalValueUseCase(
    sessionRepository,
    aiProvider
  )
  const handleCollectingItems = new HandleCollectingItemsUseCase(
    sessionRepository,
    aiProvider
  )
  const handleConfirming = new HandleConfirmingUseCase(
    sessionRepository,
    messagingProvider
  )

  const processIncomingMessage = new ProcessIncomingMessageUseCase(
    sessionRepository,
    handleNewUser,
    handleAwaitingType,
    handleAwaitingCustomerName,
    handleAwaitingTotalValue,
    handleCollectingItems,
    handleConfirming
  )

  return processIncomingMessage
}
