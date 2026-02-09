import { BackButton } from '@/components/back-button'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { fetchManyBudgets } from '@/http/api'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'
import { AlertWithoutProposal } from './-components/alert-without-proposal'
import { BudgetStatus, type BudgetsStatus } from './-components/budget-status'
import { MenuMobileAuth } from './-components/menu-mobile'

export const Route = createFileRoute('/_authenticated/proposals')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data: budgetsData, isLoading } = useQuery({
    queryKey: ['budgets'],
    queryFn: () => fetchManyBudgets(),
    staleTime: Infinity,
  })

  const formaterPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

  return (
    <>
      <BackButton to="/dashboard" />
      <div className="flex items-center justify-between mb-4">
        <div className="w-full space-y-4 md:flex md:justify-between md:items-center">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold">Minhas Propostas</h1>
              <h2 className="text-sm text-gray-500">
                Gerencie seus orçamentos e propostas
              </h2>
            </div>
            <MenuMobileAuth />
          </div>
          <Link to="/select-type-proposal">
            <Button className="cursor-pointer">Criar um novo orçamento</Button>
          </Link>
        </div>
      </div>

      <div className="relative">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="w-full h-30 rounded-lg" />
            <Skeleton className="w-full h-30 rounded-lg" />
            <Skeleton className="w-full h-30 rounded-lg" />
          </div>
        ) : budgetsData?.budgets && budgetsData?.budgets.length > 0 ? (
          <div className="flex flex-col gap-y-4">
            {budgetsData.budgets.map(budget => (
              <Link
                to={'/budget/$budget-id'}
                params={{ 'budget-id': budget.id }}
                key={budget.id}
              >
                <div className="rounded-lg shadow border p-4 cursor-pointer">
                  <div className="flex justify-between ">
                    <h2 className="text-base font-medium text-light line-clamp-2">
                      {budget.customerName}
                    </h2>
                    <span className="font-medium">
                      {formaterPrice.format(budget.total)}
                    </span>
                  </div>
                  <BudgetStatus status={budget.status as BudgetsStatus} />
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 truncate">
                      ID: {budget.id}
                    </span>
                    <ChevronRight />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="max-w-xl mx-auto">
            <AlertWithoutProposal />
          </div>
        )}
      </div>
    </>
  )
}
