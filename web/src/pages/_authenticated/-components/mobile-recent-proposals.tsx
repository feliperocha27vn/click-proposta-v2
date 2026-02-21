import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { type RecentProposal, statusStyles } from './recent-proposals-table'

interface MobileRecentProposalsProps {
  proposals: RecentProposal[]
}

export function MobileRecentProposals({
  proposals,
}: MobileRecentProposalsProps) {
  return (
    <Card className="md:hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Atividades Recentes</h2>
          <p className="text-sm text-slate-500 cursor-pointer hover:text-slate-700 transition-colors">
            Ver todas
          </p>
        </div>
      </CardHeader>
      <div className="space-y-2">
        {proposals.map(proposal => (
          <CardContent key={proposal.client}>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{proposal.client}</p>
                <p className="text-sm text-slate-500">
                  {formatDistanceToNow(new Date(), {
                    addSuffix: true,
                    locale: ptBR,
                  })}
                </p>
              </div>
              <p
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[proposal.status]}`}
              >
                {proposal.status}
              </p>
            </div>
          </CardContent>
        ))}
      </div>
    </Card>
  )
}
