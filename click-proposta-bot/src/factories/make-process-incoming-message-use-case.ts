import { GeminiService } from '../lib/gemini'
import { SessionRepository } from '../repositories/session-repository'
import { HandleAwaitingTypeUseCase } from '../use-cases/bot/handle-awaiting-type'
import { HandleCollectingItemsUseCase } from '../use-cases/bot/handle-collecting-items'
import { HandleConfirmingUseCase } from '../use-cases/bot/handle-confirming'
import { HandleNewUserUseCase } from '../use-cases/bot/handle-new-user'
import { ProcessIncomingMessageUseCase } from '../use-cases/bot/process-incoming-message'
import { SendPdfUseCase } from '../use-cases/evolution/send-pdf'
import { SendTextUseCase } from '../use-cases/evolution/send-text'

export function makeProcessIncomingMessageUseCase() {
  const sessionRepository = new SessionRepository()
  const geminiService = new GeminiService()

  const sendTextUseCase = new SendTextUseCase()
  const sendPdfUseCase = new SendPdfUseCase()

  const handleNewUser = new HandleNewUserUseCase(sessionRepository)
  const handleAwaitingType = new HandleAwaitingTypeUseCase(sessionRepository)
  const handleCollectingItems = new HandleCollectingItemsUseCase(
    sessionRepository,
    geminiService
  )
  const handleConfirming = new HandleConfirmingUseCase(
    sessionRepository,
    sendTextUseCase,
    sendPdfUseCase
  )

  const processIncomingMessage = new ProcessIncomingMessageUseCase(
    sessionRepository,
    handleNewUser,
    handleAwaitingType,
    handleCollectingItems,
    handleConfirming
  )

  return processIncomingMessage
}
