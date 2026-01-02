import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  confirmSendingProposal,
  fetchMinimalDetailsProposal,
  type FetchMinimalDetailsProposal200Item,
} from '@/http/api'
import { createFileRoute, Link } from '@tanstack/react-router'
import { AlertCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { MenuMobileAuth } from './-components/menu-mobile'

export const Route = createFileRoute('/_authenticated/proposals')({
  component: RouteComponent,
})

function RouteComponent() {
  const [minimalDetailsProposal, setMinimalDetailsProposal] = useState<
    FetchMinimalDetailsProposal200Item[]
  >([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMinimalDetailsProposal().then(reply => {
      setMinimalDetailsProposal(reply)
      setLoading(false)
    })
  }, [])

  const formaterPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

  async function handleConfirmSendProposal(proposalId: string) {
    try {
      await confirmSendingProposal(proposalId)

      window.location.reload()
    } catch (error) {
      console.error('Error confirming proposal:', error)
    }
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="w-full space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Minhas Propostas</h1>
            <MenuMobileAuth />
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="space-y-2 md:grid md:grid-cols-2 md:gap-4 xl:hidden">
          {loading ? (
            <>
              <div className="space-y-2">
                <Skeleton className="h-4 w-6/12 bg-zinc-400 md:h-20 md:w-full" />
                <Skeleton className="h-2 w-8/12 bg-zinc-400 md:h-20 md:hidden" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-6/12 bg-zinc-400 md:h-20 md:w-full" />
                <Skeleton className="h-2 w-8/12 bg-zinc-400 md:h-20 md:hidden" />
              </div>
              <div className="space-y-2 opacity-80">
                <Skeleton className="h-4 w-6/12 bg-zinc-400 md:h-20 md:w-full" />
                <Skeleton className="h-2 w-8/12 bg-zinc-400 md:h-20 md:hidden" />
              </div>
              <div className="space-y-2 opacity-60">
                <Skeleton className="h-4 w-6/12 bg-zinc-400 md:h-20 md:w-full" />
                <Skeleton className="h-2 w-8/12 bg-zinc-400 md:h-20 md:hidden" />
              </div>
            </>
          ) : minimalDetailsProposal.length > 0 ? (
            minimalDetailsProposal.map(proposal => (
              <>
                <div
                  className="border-b py-2 md:bg-neutral-100 md:p-5 md:rounded-lg md:shadow md:flex md:items-center md:gap-x-2 md:h-20"
                  key={proposal.id}
                >
                  <div className="md:space-y-2 w-full">
                    <p className="font-semibold">
                      {proposal.title || 'Proposta sem título'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Cliente: {proposal.name || 'Nome não informado'}
                    </p>
                  </div>
                  <div className="flex items-center gap-x-2 md:justify-end md:h-20 md:items-center md:border-b md:pb-2">
                    <div
                      className={`rounded-full ${proposal.status === 'DRAFT' ? 'bg-yellow-400' : proposal.status === 'SENT' ? 'bg-blue-500' : proposal.status === 'REJECTED' ? 'bg-red-500' : 'bg-green-500'} size-2`}
                    ></div>
                    <span>
                      {proposal.status === 'DRAFT'
                        ? 'Rascunho'
                        : proposal.status === 'SENT'
                          ? 'Enviada'
                          : proposal.status === 'APPROVED'
                            ? 'Aprovada'
                            : proposal.status === 'REJECTED'
                              ? 'Rejeitada'
                              : 'Desconhecido'}
                    </span>
                  </div>
                  <div className="flex gap-x-2 ms-auto mt-2">
                    <Link
                      to="/proposal/$proposal-id"
                      params={{ 'proposal-id': proposal.id }}
                    >
                      <Button className="cursor-pointer" variant="default">
                        Ver detalhes
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      className={`cursor-pointer ${proposal.status === 'SENT' ? 'hidden' : proposal.status === 'APPROVED' ? 'hidden' : proposal.status === 'REJECTED' ? 'hidden' : ''}`}
                      onClick={() => handleConfirmSendProposal(proposal.id)}
                    >
                      Confirmar envio
                    </Button>
                  </div>
                </div>
              </>
            ))
          ) : (
            <div className="space-y-4">
              <Alert className="mt-50">
                <AlertTitle className="flex items-center gap-2">
                  Atenção <AlertCircle />
                </AlertTitle>
                <AlertDescription>
                  Você ainda não tem nenhuma proposta. Clique no botão "Nova
                  proposta" para criar uma.
                </AlertDescription>
              </Alert>
              <Link to="/select-type-proposal" className="w-full">
                <Button className="w-full">Nova proposta</Button>
              </Link>
            </div>
          )}
        </div>
        <div className="border rounded-md mt-6 hidden xl:inline-table xl:w-full">
          <Table>
            <TableHeader className="bg-neutral-100">
              <TableRow>
                <TableHead className="w-75">Nome do cliente</TableHead>
                <TableHead>Proposta</TableHead>
                <TableHead className="w-50">Valor total</TableHead>
                <TableHead className="w-62.5">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {minimalDetailsProposal.map(proposal => (
                <TableRow
                  key={proposal.id}
                  className="hover:cursor-pointer hover:bg-muted/50"
                >
                  <TableCell>
                    <span>{proposal.name}</span>
                  </TableCell>
                  <TableCell>
                    <span>{proposal.title}</span>
                  </TableCell>
                  <TableCell>
                    <span>
                      {formaterPrice.format(
                        parseInt(proposal?.totalPrice || '0')
                      )}
                    </span>
                  </TableCell>
                  <TableCell className="flex items-center gap-x-2">
                    <div
                      className={`rounded-full ${proposal.status === 'DRAFT' ? 'bg-yellow-400' : proposal.status === 'SENT' ? 'bg-blue-500' : proposal.status === 'REJECTED' ? 'bg-red-500' : 'bg-green-500'} size-2`}
                    ></div>
                    <span>
                      {proposal.status === 'DRAFT'
                        ? 'Rascunho'
                        : proposal.status === 'SENT'
                          ? 'Enviada'
                          : proposal.status === 'APPROVED'
                            ? 'Aprovada'
                            : proposal.status === 'REJECTED'
                              ? 'Rejeitada'
                              : 'Desconhecido'}
                    </span>
                    <div className="flex gap-x-2 ms-auto">
                      <Button
                        variant="outline"
                        className={`cursor-pointer mx-4 ${proposal.status === 'SENT' ? 'hidden' : proposal.status === 'APPROVED' ? 'hidden' : proposal.status === 'REJECTED' ? 'hidden' : ''}`}
                        onClick={() => handleConfirmSendProposal(proposal.id)}
                      >
                        Confirmar envio
                      </Button>
                      <Link
                        to="/proposal/$proposal-id"
                        params={{ 'proposal-id': proposal.id }}
                      >
                        <Button className="cursor-pointer" variant="default">
                          Ver detalhes
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {loading && (
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-linear-to-t from-white via-white/80 to-transparent pointer-events-none" />
        )}
      </div>
    </>
  )
}
