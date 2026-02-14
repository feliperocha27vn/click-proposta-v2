import { regenerateBudgetPdf } from '@/api/generate-pdf'
import { BackButton } from '@/components/back-button'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { getByIdBudget } from '@/http/api'
import { formaterPrice } from '@/utils/formater-price'
import { useMutation, useQuery } from '@tanstack/react-query'
import { createFileRoute, useParams } from '@tanstack/react-router'
import { format, isValid } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Link as LinkIcon, Printer, UserCircleIcon } from 'lucide-react'
import { MenuMobileAuth } from '../-components/menu-mobile'
import { env } from '../../../../env'

export const Route = createFileRoute('/_authenticated/budget/$budget-id')({
  component: RouteComponent,
})

function RouteComponent() {
  const { 'budget-id': budgetId } = useParams({ strict: false })

  const { data: budgetData, isLoading } = useQuery({
    queryKey: ['budget', budgetId],
    queryFn: () => getByIdBudget(budgetId!),
  })

  const dateIsValid = isValid(new Date(budgetData?.budget.createdAt || ''))

  const createdAtFormatedDate = dateIsValid
    ? format(new Date(budgetData?.budget.createdAt || ''), 'PPP', {
        locale: ptBR,
      })
    : ''

  const shareData = {
    title: `Proposta #${budgetData?.budget.id?.slice(0, 8)} - Click Proposta`,
    text: `Olá ${budgetData?.budget.customerName}, confira seu orçamento de ${formaterPrice(budgetData?.budget.total || 0)}!`,
    url: `${env.VITE_APP_URL}/public-budget/${budgetId}`,
  }

  const { mutate: regeneratePdfFn, isPending: isPendingPdf } = useMutation({
    mutationFn: regenerateBudgetPdf,
  })

  async function handleShare() {
    try {
      await navigator.share(shareData)
    } catch (error) {
      console.error('Erro ao compartilhar:', error)
    }
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <BackButton to="/proposals" />
        <MenuMobileAuth />
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center">
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      ) : (
        <div className="space-y-4 max-w-2xl mx-auto">
          <div className="flex flex-col">
            <span className="text-lg font-semibold">
              Proposta #{budgetData?.budget.id?.slice(0, 8)}
            </span>
            <span className="text-sm text-muted-foreground">
              Criado em {createdAtFormatedDate}
            </span>
          </div>
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6 rounded-lg shadow bg-zinc-50 border-zinc-200">
            <div>
              <h3 className="text-sm font-medium text-muted-light dark:text-muted-dark uppercase tracking-wider">
                Valor Total
              </h3>
              <div className="mt-2 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                {formaterPrice(budgetData?.budget.total || 0)}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-light dark:text-muted-dark uppercase tracking-wider">
                Cliente
              </h3>
              <div className="mt-2 flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 dark:text-zinc-400">
                  <UserCircleIcon />
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                    {budgetData?.budget.customerName}
                  </p>
                  <p className="text-xs font-mono text-muted-light dark:text-muted-dark truncate max-w-37.5">
                    {budgetData?.budget.customersId}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
              Serviços
            </h2>
            <div className="space-y-3">
              <Accordion
                type="single"
                collapsible
                defaultValue={budgetData?.budget.budgetsServices[0].id}
              >
                {budgetData?.budget.budgetsServices.map(service => (
                  <AccordionItem value={service.id} key={service.id}>
                    <AccordionTrigger>{service.title}</AccordionTrigger>
                    <AccordionContent>{service.description}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              <div className="flex gap-x-2">
                <Button
                  className="w-full"
                  onClick={() => budgetId && regeneratePdfFn(budgetId)}
                  disabled={isPendingPdf}
                >
                  <Printer />
                  {isPendingPdf ? 'Gerando...' : 'PDF'}
                </Button>
              </div>
              <Button
                className="w-full"
                onClick={handleShare}
                variant="secondary"
              >
                <LinkIcon />
                Compartilhar link da proposta
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
