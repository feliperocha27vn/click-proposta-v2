type BudgetsStatus = 'DRAFT' | 'SENT' | 'APPROVED' | 'REJECTED'

interface BudgetStatusProps {
    status: BudgetsStatus
}

const orderStatusMap: Record<BudgetsStatus, string> = {
    DRAFT: 'Rascunho',
    SENT: 'Enviado',
    APPROVED: 'Aprovado',
    REJECTED: 'Rejeitado',
}

export function BudgetStatus({ status }: BudgetStatusProps) {
    return (
        <>
            {status === 'DRAFT' && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50" >
                    {orderStatusMap[status]}
                </span>
            )}
            {status === 'SENT' && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800/50" >
                    {orderStatusMap[status]}
                </span>
            )}
            {status === 'REJECTED' && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border border-red-200 dark:border-red-800/50" >
                    {orderStatusMap[status]}
                </span>
            )}
            {status === 'APPROVED' && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border border-green-200 dark:border-green-800/50">
                    {orderStatusMap[status]}
                </span>
            )}
        </>
    )
}