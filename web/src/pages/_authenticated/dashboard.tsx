import { createFileRoute, Link } from '@tanstack/react-router'
import {
  CreditCard,
  DollarSign,
  FileText,
  MessageCircleMore,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useCountTotalAndAcceptedProposals } from '@/gen/hooks/ProposalsHooks/useCountTotalAndAcceptedProposals'
import { useGetProposalAndBudgetTotalValue } from '@/gen/hooks/ProposalsHooks/useGetProposalAndBudgetTotalValue'
import { useGetCompleteRegister } from '@/gen/hooks/UsersHooks/useGetCompleteRegister'
import FormCompleteCustomer from './-components/form-complete-customer'
import { MenuMobileAuth } from './-components/menu-mobile'
import { RecentProposalsChart } from './-components/recent-proposals-chart'

export const Route = createFileRoute('/_authenticated/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  const [completeModal, setCompleteModal] = useState(false)

  const { data: registerStatus, isLoading: isLoadingRegister } =
    useGetCompleteRegister({
      query: {
        staleTime: Infinity,
      },
    })

  const { data: proposalsCount } = useCountTotalAndAcceptedProposals({
    query: {
      staleTime: 1000 * 60 * 5,
    },
  })

  const { data: totalValueData } = useGetProposalAndBudgetTotalValue({
    query: {
      staleTime: 1000 * 60 * 5,
    },
  })

  useEffect(() => {
    if (
      !isLoadingRegister &&
      typeof registerStatus === 'object' &&
      registerStatus?.isRegisterComplete === false
    ) {
      setCompleteModal(true)
    }
  }, [registerStatus, isLoadingRegister])

  const stats = [
    {
      title: 'Total de Propostas',
      value: proposalsCount?.total?.toString() || '0',
      icon: FileText,
    },
    {
      title: 'Valor Total Acumulado',
      value: (totalValueData?.totalValue || 0).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }),
      icon: DollarSign,
    },
  ]

  function sendMessageToBot() {
    const message = 'Olá gostaria de criar um novo orçamento'

    const urlWpp = `https://wa.me/5518988269708?text=${encodeURIComponent(message)}`

    window.open(urlWpp, '_blank')
  }

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
          <div className="h-full rounded-3xl bg-linear-to-br from-indigo-100 via-purple-100 to-indigo-50 p-8 flex flex-col justify-center gap-6 relative overflow-hidden  shadow-sm">
            <div className="z-10 space-y-2">
              <h2 className="text-3xl font-bold text-slate-900">
                Bem vindo de volta
              </h2>
              <p className="text-slate-600 max-w-md">
                Crie propostas profissionais em segundos.
              </p>
            </div>
            <div className="z-10 flex flex-col gap-4 xl:flex-row">
              <Link to="/select-type-proposal">
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl px-6 py-6 shadow-indigo-200 shadow-lg transition-all hover:scale-105 w-full">
                  Criar Nova Proposta
                </Button>
              </Link>
              <Button
                onClick={sendMessageToBot}
                className="bg-green-500 hover:bg-teal-700 text-zinc-50  font-semibold rounded-xl px-6 py-6 shadow-green-200 shadow-lg transition-all hover:scale-105 w-full xl:w-auto border border-gren-500"
              >
                <MessageCircleMore />
                Criar orçamento pelo WhatsApp
              </Button>
            </div>
            {/* Decorative glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-300/40 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-200/40 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none" />
          </div>
        </div>

        <div className="col-span-4 lg:col-span-3 grid grid-cols-2 gap-4">
          {stats.map((stat, index) => (
            <div
              key={stat.title}
              className="bg-white flex flex-col gap-3 p-4 md:p-5 rounded-2xl  shadow-sm hover:border-slate-200 transition-colors xl:justify-evenly"
            >
              <div
                className={`p-2.5 rounded-xl w-fit ${
                  index === 0
                    ? 'bg-blue-50 text-blue-600 border border-blue-200'
                    : index === 1
                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                      : index === 2
                }`}
              >
                <stat.icon className="size-5 md:size-6 xl:size-7" />
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

      <div className="grid grid-cols-1">
        <RecentProposalsChart />
      </div>

      <FormCompleteCustomer
        isOpen={completeModal}
        onClose={() => setCompleteModal(false)}
      />
    </div>
  )
}
