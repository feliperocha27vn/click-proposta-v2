import { Button } from '@/components/ui/button'
import { createFileRoute, Link } from '@tanstack/react-router'
import { LucideCheck } from 'lucide-react'

export const Route = createFileRoute('/_authenticated/success-payment')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="w-full min-h-screen flex flex-col justify-around items-center">
      <div className="space-y-20 bg-zinc-50 p-6 rounded-lg shadow-md max-w-lg">
        <div className="mt-6 text-center">
          <h1 className="text-2xl font-semibold flex items-center justify-center gap-2">
            Pagamento confirmado <LucideCheck color="green" size={36} />
          </h1>
          <p className="text-[#0d141b] text-base font-normal leading-normal pb-3 pt-1 px-4 text-center">
            O seu pagamento foi processado com sucesso. O seu plano foi
            atualizado e as novas funcionalidades estão disponíveis.
          </p>
        </div>
        <Link to="/dashboard" className="w-full">
          <Button className="w-full cursor-pointer">
            Voltar para o início
          </Button>
        </Link>
      </div>
    </div>
  )
}
