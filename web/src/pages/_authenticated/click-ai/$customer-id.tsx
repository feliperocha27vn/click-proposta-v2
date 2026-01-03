import { BackButton } from '@/components/back-button'
import { createFileRoute } from '@tanstack/react-router'
import { ChatInputIa } from './-components/chat-input-ia'

export const Route = createFileRoute('/_authenticated/click-ai/$customer-id')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <BackButton to="/select-costumer" />
      <div className="min-h-screen flex flex-col items-center justify-center">
        <ChatInputIa />
      </div>
    </>
  )
}
