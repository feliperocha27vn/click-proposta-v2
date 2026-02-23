import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth-context'
import { getCompleteRegister } from '@/http/api'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { CreditCard, FileText } from 'lucide-react'
import { useEffect, useState } from 'react'
import FormCompleteCustomer from './-components/form-complete-customer'
import { LoadingValidationModal } from './-components/loading-validation-modal'
import { MenuMobileAuth } from './-components/menu-mobile'
import { MobileRecentProposals } from './-components/mobile-recent-proposals'
import {
  type RecentProposal,
  RecentProposalsTable,
} from './-components/recent-proposals-table'

export const Route = createFileRoute('/_authenticated/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  const { session } = useAuth()
  const user = session?.user ?? null
  const [completeModal, setCompleteModal] = useState(false)

  const { data: registerStatus, isLoading: loadingValidation } = useQuery({
    queryKey: ['complete-register'],
    queryFn: getCompleteRegister,
    staleTime: Infinity,
  })

  useEffect(() => {
    if (registerStatus && !registerStatus.isRegisterComplete) {
      setCompleteModal(true)
    }
  }, [registerStatus])

  const stats = [
    {
      title: 'Total de Propostas',
      value: '12',
      icon: FileText,
    },
    {
      title: 'Propostas Aceitas',
      value: '4',
      icon: CreditCard,
    },
  ]

  const recentProposals: RecentProposal[] = [
    {
      client: 'Acme Corp',
      description: 'Site Institucional',
      date: '19 Out, 2026',
      amount: 'R$ 5.000,00',
      status: 'Enviado',
    },
    {
      client: 'TechStart Inc',
      description: 'Aplicativo Mobile',
      date: '18 Out, 2026',
      amount: 'R$ 3.200,00',
      status: 'Pendente',
    },
    {
      client: 'Global Solutions',
      description: 'Sistema ERP',
      date: '15 Out, 2026',
      amount: 'R$ 8.500,00',
      status: 'Aceito',
    },
    {
      client: 'Local Bakery',
      description: 'Site Institucional',
      date: '12 Out, 2026',
      amount: 'R$ 1.200,00',
      status: 'Rascunho',
    },
    {
      client: 'Consultoria Silva',
      description: 'Consultoria',
      date: '10 Out, 2026',
      amount: 'R$ 4.000,00',
      status: 'Rejeitado',
    },
  ]

  return (
    <div className="space-y-6  pt-6 min-h-screen font-inter">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Painel
        </h2>
        <div className="xl:hidden">
          <MenuMobileAuth />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 lg:col-span-4">
          <div className="h-full rounded-3xl bg-linear-to-br from-indigo-100 via-purple-100 to-indigo-50 p-8 flex flex-col justify-center gap-6 relative overflow-hidden border border-indigo-100/50 shadow-sm">
            <div className="z-10 space-y-2">
              <h2 className="text-3xl font-bold text-slate-900">
                Bem vindo de volta,{' '}
                {user?.user_metadata?.full_name?.split(' ')[0] || 'Usuário'}!
                <span className="xl:hidden">
                  {' '}
                  Você possui 10 créditos para criar propostas.
                </span>
              </h2>
              <p className="text-slate-600 max-w-md">
                Crie propostas profissionais em segundos.
              </p>
            </div>
            <div className="z-10">
              <Link to="/select-type-proposal">
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl px-6 py-6 shadow-indigo-200 shadow-lg transition-all hover:scale-105">
                  Criar Nova Proposta
                </Button>
              </Link>
            </div>
            {/* Decorative glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-200/40 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-200/40 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none" />
          </div>
        </div>

        <div className="col-span-4 lg:col-span-3 grid grid-cols-2 gap-4">
          {stats.map((stat, index) => (
            <div
              key={stat.title}
              className="bg-white flex flex-col gap-3 p-4 md:p-5 rounded-2xl  shadow-sm hover:border-slate-200 transition-colors"
            >
              <div
                className={`p-2.5 rounded-xl w-fit ${
                  index === 0
                    ? 'bg-blue-50 text-blue-600 border border-blue-200'
                    : index === 1
                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                      : index === 2
                        ? 'bg-amber-50 text-amber-600 border border-amber-200'
                        : 'bg-indigo-50 text-indigo-600 border border-indigo-200'
                }`}
              >
                <stat.icon className="size-5 md:size-6" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs md:text-sm font-medium text-slate-500">
                  {stat.title}
                </p>
                <h3 className="text-lg md:text-xl font-bold text-slate-900">
                  {stat.value}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="gap-4 grid-cols-1 hidden md:grid">
        <RecentProposalsTable proposals={recentProposals} />
      </div>
      <MobileRecentProposals proposals={recentProposals} />

      <FormCompleteCustomer
        isOpen={completeModal}
        onClose={() => setCompleteModal(false)}
      />
      <LoadingValidationModal isOpen={loadingValidation} />
    </div>
  )
}
