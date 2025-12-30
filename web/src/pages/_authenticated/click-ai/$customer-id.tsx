import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { ChatInputIa } from './-components/chat-input-ia'

export const Route = createFileRoute('/_authenticated/click-ai/$customer-id')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <Link to="/select-costumer">
        <ArrowLeft className="cursor-pointer" />
      </Link>
      <div className="min-h-screen flex flex-col items-center justify-center">
        <ChatInputIa />
      </div>
    </>
  )
}
