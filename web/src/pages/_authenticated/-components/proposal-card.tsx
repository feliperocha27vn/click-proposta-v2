import { ChevronRight } from 'lucide-react'
import { BudgetStatus, type BudgetsStatus } from './budget-status'

interface ProposalCardProps {
  id: string
  title: string
  type: 'budget' | 'proposal'
  status: BudgetsStatus
  price: number
  onClick?: () => void
}

export function ProposalCard({
  id,
  title,
  type,
  status,
  price,
  onClick,
}: ProposalCardProps) {
  const formaterPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

  const typeLabel = type === 'budget' ? 'Orçamento' : 'Proposta'
  const typeColor = type === 'budget'
    ? 'bg-blue-100 text-blue-700'
    : 'bg-purple-100 text-purple-700'

  // Trunca o ID para mostrar apenas início e fim
  const truncatedId = `${id.slice(0, 6)}...${id.slice(-5)}`

  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full text-left bg-white rounded-2xl border border-gray-200 p-5 cursor-pointer 
                 shadow-sm hover:shadow-md transition-all duration-200 
                 hover:border-gray-300"
    >
      {/* Header com badges e chevron */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {/* Badge de tipo */}
          <span className={`px-3 py-1.5 text-sm font-medium rounded-lg ${typeColor}`}>
            {typeLabel}
          </span>
          {/* Badge de status */}
          <BudgetStatus status={status} />
        </div>
        {/* Chevron */}
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </div>

      {/* Conteúdo principal - layout horizontal */}
      <div className="flex items-end justify-between">
        {/* Lado esquerdo: Título e ID */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-lg mb-1 line-clamp-2">
            {title}
          </h3>
          <span className="inline-block px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-md">
            ID: {truncatedId}
          </span>
        </div>

        {/* Lado direito: Valor */}
        <div className="text-right ml-4">
          <p className="text-sm text-gray-500 mb-1">Valor Total</p>
          <p className="text-2xl font-bold text-blue-600">
            {formaterPrice.format(price)}
          </p>
        </div>
      </div>
    </button>
  )
}
