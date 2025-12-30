import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft, Hammer, Sparkles } from 'lucide-react'

export const Route = createFileRoute(
    '/_authenticated/_create-proposal/select-type-proposal',
)({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <div className='space-y-4'>
            <div className='w-1/12 xl:hidden'>
                <Link to="/dashboard" >
                    <ArrowLeft />
                </Link>
            </div>
            <div className='flex flex-col gap-y-4 xl:grid xl:grid-cols-2 xl:gap-x-4'>
                <Link to="/select-costumer" search={{ type: 'budget-civil' }} >
                    <div className='flex items-center justify-evenly border-zinc rounded-lg shadow  w-full border py-2'>
                        <span className='font-medium text-xl'>Orçamento Civil</span>
                        <Hammer size={32} />
                    </div>
                </Link>
                <Link to="/select-costumer" search={{ type: 'proposal-with-ai' }} >
                    <div className='flex items-center justify-evenly border-zinc rounded-lg shadow  w-full border py-2'>
                        <span className='font-medium text-xl'>Proposta com IA</span>
                        <Sparkles size={32} />
                    </div>
                </Link>
            </div>
        </div>
    )
}
