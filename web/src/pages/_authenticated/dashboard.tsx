import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useAuth } from '@/contexts/auth-context'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Clock, CreditCard, DollarSign, FileText } from 'lucide-react'
import { MenuMobileAuth } from './-components/menu-mobile'

export const Route = createFileRoute('/_authenticated/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  const { session } = useAuth()
  const user = session?.user ?? null

  const stats = [
    {
      title: 'Total de Propostas',
      value: '12',
      icon: FileText,
      description: '+2 esse mês',
    },
    {
      title: 'Propostas Aceitas',
      value: '4',
      icon: CreditCard,
      description: '33% de taxa de conversão',
    },
    {
      title: 'Propostas Pendentes',
      value: '8',
      icon: Clock,
      description: '8 propostas aguardando aprovação',
    },
    {
      title: 'Receita Pendente',
      value: 'R$ 12.450,00',
      icon: DollarSign,
      description: 'Previsão para o próximo mês',
    },
  ]

  const recentProposals = [
    {
      client: 'Acme Corp',
      date: '19 Out, 2026',
      amount: 'R$ 5.000,00',
      status: 'Enviado',
    },
    {
      client: 'TechStart Inc',
      date: '18 Out, 2026',
      amount: 'R$ 3.200,00',
      status: 'Pendente',
    },
    {
      client: 'Global Solutions',
      date: '15 Out, 2026',
      amount: 'R$ 8.500,00',
      status: 'Aceito',
    },
    {
      client: 'Local Bakery',
      date: '12 Out, 2026',
      amount: 'R$ 1.200,00',
      status: 'Rascunho',
    },
    {
      client: 'Consultoria Silva',
      date: '10 Out, 2026',
      amount: 'R$ 4.000,00',
      status: 'Rejeitado',
    },
  ]

  return (
    <div className="space-y-6 p-8 pt-6 min-h-screen font-inter">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Painel</h2>
        <div className="xl:hidden">
            <MenuMobileAuth />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 lg:col-span-4">
            <div className="h-full rounded-3xl bg-linear-to-br from-indigo-100 via-purple-100 to-indigo-50 p-8 flex flex-col justify-center gap-6 relative overflow-hidden border border-indigo-100/50 shadow-sm">
                <div className="z-10 space-y-2">
                    <h2 className="text-3xl font-bold text-slate-900">
                        Bem vindo de volta, {user?.user_metadata?.full_name?.split(' ')[0] || 'Usuário'}!
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

        <div className="col-span-3 lg:col-span-3 grid grid-cols-2 gap-4">
            {stats.map((stat, index) => (
                <div key={index} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:border-slate-200 transition-colors">
                    <div className="flex items-start justify-between">
                        <div className={`p-3 rounded-xl ${
                            index === 0 ? 'bg-blue-50 text-blue-600' :
                            index === 1 ? 'bg-emerald-50 text-emerald-600' :
                            index === 2 ? 'bg-amber-50 text-amber-600' :
                            'bg-indigo-50 text-indigo-600'
                        }`}>
                            <stat.icon className="size-6" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                        <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
                    </div>
                </div>
            ))}
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1">
        <Card className="col-span-1 border-slate-100 shadow-sm bg-white rounded-2xl overflow-hidden">
          <CardHeader className="border-b border-slate-50 bg-white px-6 py-4">
            <CardTitle className="text-lg font-semibold text-slate-900">Propostas Recentes</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-100 bg-slate-50/50 hover:bg-slate-50/50">
                  <TableHead className="text-xs font-medium uppercase text-slate-500 pl-6">Cliente</TableHead>
                  <TableHead className="text-xs font-medium uppercase text-slate-500">Proposta</TableHead>
                  <TableHead className="text-xs font-medium uppercase text-slate-500">Data</TableHead>
                  <TableHead className="text-xs font-medium uppercase text-slate-500">Valor</TableHead>
                  <TableHead className="text-xs font-medium uppercase text-slate-500">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentProposals.map((proposal, index) => (
                  <TableRow key={index} className="border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <TableCell className="font-medium text-slate-900 pl-6 py-4">
                      {proposal.client}
                    </TableCell>
                    <TableCell className="text-slate-600">Site Institucional</TableCell>
                    <TableCell className="text-slate-600">{proposal.date}</TableCell>
                    <TableCell className="font-medium text-slate-900">{proposal.amount}</TableCell>
                    <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            proposal.status === 'Aceito' ? 'bg-emerald-100 text-emerald-700' :
                            proposal.status === 'Enviado' ? 'bg-blue-100 text-blue-700' :
                            proposal.status === 'Rejeitado' ? 'bg-red-100 text-red-700' :
                            'bg-slate-100 text-slate-700'
                        }`}>
                            {proposal.status}
                        </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
