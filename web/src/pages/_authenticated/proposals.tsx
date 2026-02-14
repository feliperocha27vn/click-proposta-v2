import { BackButton } from '@/components/back-button'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { fetchManyBudgets, fetchMinimalDetailsProposal } from '@/http/api'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { AlertWithoutProposal } from './-components/alert-without-proposal'
import type { BudgetsStatus } from './-components/budget-status'
import { MenuMobileAuth } from './-components/menu-mobile'
import { ProposalCard } from './-components/proposal-card'

export const Route = createFileRoute('/_authenticated/proposals')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const { data: budgetsData, isLoading: isLoadingBudgets } = useQuery({
    queryKey: ['budgets'],
    queryFn: () => fetchManyBudgets(),
    staleTime: Infinity,
  })

  const { data: proposalsData, isLoading: isLoadingProposals } = useQuery({
    queryKey: ['proposals'],
    queryFn: () => fetchMinimalDetailsProposal(),
    staleTime: Infinity,
  })

  const hasBudgets = budgetsData?.budgets && budgetsData.budgets.length > 0
  const hasProposals = proposalsData && proposalsData.length > 0

  const handleBudgetClick = (budgetId: string) => {
    navigate({ to: '/budget/$budget-id', params: { 'budget-id': budgetId } })
  }

  const handleProposalClick = (proposalId: string) => {
    navigate({
      to: '/proposal/$proposal-id',
      params: { 'proposal-id': proposalId },
    })
  }

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
            <Button className="cursor-pointer">Criar novo</Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="budgets">Orçamentos</TabsTrigger>
          <TabsTrigger value="proposals">Propostas</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <div className="relative">
            {isLoadingBudgets || isLoadingProposals ? (
              <div className="space-y-4">
                <Skeleton className="w-full h-30 rounded-lg" />
                <Skeleton className="w-full h-30 rounded-lg" />
                <Skeleton className="w-full h-30 rounded-lg" />
              </div>
            ) : hasBudgets || hasProposals ? (
              <div className="flex flex-col gap-y-4">
                {/* Budgets */}
                {budgetsData?.budgets.map(budget => (
                  <ProposalCard
                    key={`budget-${budget.id}`}
                    id={budget.id}
                    title={budget.customerName}
                    type="budget"
                    status={budget.status as BudgetsStatus}
                    price={budget.total}
                    onClick={() => handleBudgetClick(budget.id)}
                  />
                ))}

                {/* Proposals */}
                {proposalsData?.map(proposal => (
                  <ProposalCard
                    key={`proposal-${proposal.id}`}
                    id={proposal.id}
                    title={proposal.title}
                    type="proposal"
                    status={proposal.status as BudgetsStatus}
                    price={Number(proposal.totalPrice)}
                    onClick={() => handleProposalClick(proposal.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="max-w-xl mx-auto">
                <AlertWithoutProposal />
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="budgets" className="mt-4">
          <div className="relative">
            {isLoadingBudgets ? (
              <div className="space-y-4">
                <Skeleton className="w-full h-30 rounded-lg" />
                <Skeleton className="w-full h-30 rounded-lg" />
                <Skeleton className="w-full h-30 rounded-lg" />
              </div>
            ) : hasBudgets ? (
              <div className="flex flex-col gap-y-4">
                {budgetsData?.budgets.map(budget => (
                  <ProposalCard
                    key={budget.id}
                    id={budget.id}
                    title={budget.customerName}
                    type="budget"
                    status={budget.status as BudgetsStatus}
                    price={budget.total}
                    onClick={() => handleBudgetClick(budget.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="max-w-xl mx-auto">
                <AlertWithoutProposal type="budget" />
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="proposals" className="mt-4">
          <div className="relative">
            {isLoadingProposals ? (
              <div className="space-y-4">
                <Skeleton className="w-full h-30 rounded-lg" />
                <Skeleton className="w-full h-30 rounded-lg" />
                <Skeleton className="w-full h-30 rounded-lg" />
              </div>
            ) : hasProposals ? (
              <div className="flex flex-col gap-y-4">
                {proposalsData?.map(proposal => (
                  <ProposalCard
                    key={proposal.id}
                    id={proposal.id}
                    title={proposal.title}
                    type="proposal"
                    status={proposal.status as BudgetsStatus}
                    price={Number(proposal.totalPrice)}
                    onClick={() => handleProposalClick(proposal.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="max-w-xl mx-auto">
                <AlertWithoutProposal type="proposal" />
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </>
  )
}
