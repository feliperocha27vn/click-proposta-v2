import { BackButton } from '@/components/back-button'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Hammer, Package } from 'lucide-react'

export const Route = createFileRoute(
  '/_authenticated/_create-proposal/select-type-proposal'
)({
  component: SelectProposalTypePage,
})

function SelectProposalTypePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 font-inter">
      <div className="w-full max-w-4xl space-y-12">
        <div className="flex items-center justify-start xl:hidden top-6 left-6">
          <BackButton to="/dashboard" />
        </div>

        <div className="text-center space-y-4 mt-8 xl:mt-0">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            O que você deseja orçar hoje?
          </h1>
          <p className="text-lg text-slate-600">
            Selecione o tipo de orçamento para começar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Civil Budget Card */}
          <Link
            to="/select-costumer"
            search={{ type: 'budget-civil' }}
            className="group relative flex flex-col items-center p-10 bg-white rounded-3xl border border-slate-200 shadow-sm hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 text-center space-y-8"
          >
            <div className="h-24 w-24 rounded-3xl bg-blue-50 flex items-center justify-center text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white transform group-hover:scale-110 duration-300">
              <Hammer className="h-12 w-12" />
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                Orçamento Civil
              </h3>
              <p className="text-slate-500 leading-relaxed max-w-xs mx-auto">
                Elabore propostas detalhadas para projetos de construção,
                reformas e serviços de engenharia.
              </p>
            </div>
          </Link>

          {/* Products Budget Card */}
          <Link
            to="/select-costumer"
            search={{ type: 'budget-products' }}
            className="group relative flex flex-col items-center p-10 bg-white rounded-3xl border border-slate-200 shadow-sm hover:border-amber-200 hover:shadow-xl hover:shadow-amber-900/5 transition-all duration-300 text-center space-y-8"
          >
            <div className="h-24 w-24 rounded-3xl bg-amber-50 flex items-center justify-center text-amber-600 transition-colors group-hover:bg-amber-500 group-hover:text-white transform group-hover:scale-110 duration-300">
              <Package className="h-12 w-12" />
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                Orçamento de Produtos
              </h3>
              <p className="text-slate-500 leading-relaxed max-w-xs mx-auto">
                Crie cotações precisas para venda de produtos, materiais e itens
                comerciais.
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
