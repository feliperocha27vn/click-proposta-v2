import { BackButton } from '@/components/back-button'
import { getByIdBudget } from '@/http/api'
import { formaterPrice } from '@/utils/formater-price'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, useParams } from '@tanstack/react-router'
import { format, isValid } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Hammer, UserCircleIcon } from 'lucide-react'
import { MenuMobileAuth } from '../-components/menu-mobile'

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

    return (
        <>
            <div className="flex items-center justify-between">
                <BackButton to="/proposals" />
                <MenuMobileAuth />
            </div>
            {isLoading ? (
                <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            ) : (
                <div className="space-y-4">
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
                                    <p className="text-xs font-mono text-muted-light dark:text-muted-dark truncate max-w-[150px]">
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
                            {budgetData?.budget.budgetsServices.map(service => (
                                <div
                                    key={service.id}
                                    className="p-4 rounded-lg border shadow border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900"
                                >
                                    <div className="w-12 h-12 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 dark:text-zinc-400 group-hover:bg-zinc-200 dark:group-hover:bg-zinc-700 transition-colors">
                                        <Hammer />
                                    </div>
                                    <h3 className="font-medium text-zinc-900 dark:text-zinc-50">
                                        {service.title}
                                    </h3>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                                        {service.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
