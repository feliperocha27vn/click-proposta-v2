import { BackButton } from '@/components/back-button'
import { createFileRoute } from '@tanstack/react-router'
import { MenuMobileAuth } from './-components/menu-mobile'

export const Route = createFileRoute('/_authenticated/budgets')({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <>
            <BackButton to="/dashboard" />
            <div className="flex items-center justify-between mb-4">
                <div className="w-full space-y-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-semibold">Orçamentos</h1>
                        <MenuMobileAuth />
                    </div>
                </div>
            </div>
        </>
    )
}
