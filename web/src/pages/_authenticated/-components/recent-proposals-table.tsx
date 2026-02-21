import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export type ProposalStatus =
  | 'Aceito'
  | 'Enviado'
  | 'Rejeitado'
  | 'Pendente'
  | 'Rascunho'

export interface RecentProposal {
  client: string
  description: string
  date: string
  amount: string
  status: ProposalStatus
}

interface RecentProposalsTableProps {
  proposals: RecentProposal[]
  title?: string
  className?: string
}

export const statusStyles: Record<ProposalStatus, string> = {
  Aceito: 'bg-emerald-100 text-emerald-700',
  Enviado: 'bg-blue-100 text-blue-700',
  Rejeitado: 'bg-red-100 text-red-700',
  Pendente: 'bg-amber-100 text-amber-700',
  Rascunho: 'bg-slate-100 text-slate-700',
}

export function RecentProposalsTable({
  proposals,
  title = 'Propostas Recentes',
  className,
}: RecentProposalsTableProps) {
  return (
    <Card
      className={`col-span-1 border-slate-100 shadow-sm bg-white rounded-2xl overflow-hidden ${className ?? ''}`}
    >
      <CardHeader className="border-b border-slate-50 bg-white px-6 py-4">
        <CardTitle className="text-lg font-semibold text-slate-900">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-100 bg-slate-50/50 hover:bg-slate-50/50">
              <TableHead className="text-xs font-medium uppercase text-slate-500 pl-6">
                Cliente
              </TableHead>
              <TableHead className="text-xs font-medium uppercase text-slate-500">
                Proposta
              </TableHead>
              <TableHead className="text-xs font-medium uppercase text-slate-500">
                Data
              </TableHead>
              <TableHead className="text-xs font-medium uppercase text-slate-500">
                Valor
              </TableHead>
              <TableHead className="text-xs font-medium uppercase text-slate-500">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {proposals.map(proposal => (
              <TableRow
                key={proposal.client}
                className="border-slate-50 hover:bg-slate-50/50 transition-colors"
              >
                <TableCell className="font-medium text-slate-900 pl-6 py-4">
                  {proposal.client}
                </TableCell>
                <TableCell className="text-slate-600">
                  {proposal.description}
                </TableCell>
                <TableCell className="text-slate-600">
                  {proposal.date}
                </TableCell>
                <TableCell className="font-medium text-slate-900">
                  {proposal.amount}
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[proposal.status]}`}
                  >
                    {proposal.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
