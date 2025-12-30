import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  approveProposal,
  getProposalById,
  recuseProposal,
  type GetProposalById200,
} from '@/http/api'
import {
  createFileRoute,
  Link,
  useParams,
  useSearch,
} from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import Logo from '../../assets/logo.png'

interface PlanUserProps {
  plan: 'FREE' | 'PRO'
}

export const Route = createFileRoute('/public-proposal/$proposal-id')({
  component: RouteComponent,
})

function RouteComponent() {
  const { 'proposal-id': proposalId } = useParams({ strict: false })
  const [proposal, setProposal] = useState<GetProposalById200>()
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [rejectModalOpen, setRejectModalOpen] = useState(false)

  const object: PlanUserProps = useSearch({
    from: '/public-proposal/$proposal-id',
  })

  if (!proposalId) {
    console.log('ID da proposta não fornecido')
  }

  useEffect(() => {
    if (proposalId) {
      getProposalById(proposalId).then(reply => {
        setProposal(reply)
        setLoading(false)
      })
    }
  }, [proposalId])

  const formaterPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

  async function handleAcceptProposal(proposalId: string) {
    try {
      await approveProposal(proposalId)
    } catch (error) {
      console.error('Erro ao aceitar a proposta:', error)
    }
  }

  async function handleRejectProposal(proposalId: string) {
    try {
      await recuseProposal(proposalId)
      setRejectModalOpen(true)
    } catch (error) {
      console.error('Erro ao rejeitar a proposta:', error)
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div className="max-w-2xl min-h-screen flex flex-col items-center p-4">
        <div className="w-full flex space-x-4 justify-center items-center p-4 border-b">
          <img
            src={Logo}
            alt="Logo da Click Proposta"
            className={`w-26 ${object.plan === 'PRO' ? 'hidden' : 'opacity-30'}`}
          />
          {loading ? (
            <Skeleton className="h-6 w-48 bg-zinc-300" />
          ) : (
            <h1 className="font-semibold">{proposal?.title}</h1>
          )}
        </div>
        <div className="w-full flex flex-col items-center space-y-2 mt-4">
          {loading ? (
            <Skeleton className="h-8 w-64 bg-zinc-300" />
          ) : (
            <h1 className="font-semibold text-2xl">{proposal?.customerName}</h1>
          )}
          <div className="w-full space-y-4">
            {loading ? (
              <>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full bg-zinc-300" />
                  <Skeleton className="h-4 w-5/6 bg-zinc-300" />
                  <Skeleton className="h-4 w-4/6 bg-zinc-300" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-6 w-48 bg-zinc-300" />
                  <Skeleton className="h-4 w-full bg-zinc-300" />
                  <Skeleton className="h-4 w-3/4 bg-zinc-300" />
                </div>
                <div className="bg-zinc-50 rounded-lg p-4 shadow space-y-2">
                  <Skeleton className="h-6 w-32 bg-zinc-300" />
                  <Skeleton className="h-4 w-full bg-zinc-300" />
                  <Skeleton className="h-4 w-5/6 bg-zinc-300" />
                </div>
              </>
            ) : (
              <>
                <div>
                  <p>{proposal?.welcomeDescription}</p>
                </div>
                <div className="space-y-1">
                  <h2 className="text-lg font-semibold">
                    Nosso principal desafio
                  </h2>
                  <p>{proposal?.challenge}</p>
                </div>
                <div className="bg-zinc-50 rounded-lg p-4 shadow">
                  <h2 className="font-semibold text-lg mb-2">Nossa solução</h2>
                  <p>{proposal?.solution}</p>
                </div>
              </>
            )}
          </div>
          <div className="w-full mt-4 space-y-2">
            {loading ? (
              <>
                <Skeleton className="h-6 w-64 bg-zinc-300 mx-auto" />
                <div className="space-y-3 mt-4">
                  <Skeleton className="h-6 w-32 bg-zinc-300" />
                  <Skeleton className="h-4 w-full bg-zinc-300" />
                  <Skeleton className="h-4 w-4/5 bg-zinc-300" />
                </div>
                <div className="space-y-3 mt-4">
                  <Skeleton className="h-6 w-40 bg-zinc-300" />
                  <Skeleton className="h-4 w-full bg-zinc-300" />
                  <Skeleton className="h-4 w-3/4 bg-zinc-300" />
                </div>
              </>
            ) : (
              <>
                <h2 className="text-lg text-center font-semibold">
                  Serviços e Investimentos
                </h2>
                <div className="space-y-3 mt-4">
                  <div>
                    <h2 className="text-lg font-semibold">Porque nós?</h2>
                    <p>{proposal?.whyUs}</p>
                  </div>
                </div>
                <div className="space-y-3 mt-4">
                  <div>
                    <h2 className="text-lg font-semibold">
                      Resultados Esperados
                    </h2>
                    <p>{proposal?.results}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="w-full bg-zinc-50 rounded-lg shadow p-3 mt-10">
          {loading ? (
            <>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-2">
                  <Skeleton className="h-4 w-32 bg-zinc-300" />
                  <Skeleton className="h-4 w-24 bg-zinc-300" />
                </div>
                <div className="flex justify-between items-center p-2">
                  <Skeleton className="h-4 w-40 bg-zinc-300" />
                  <Skeleton className="h-4 w-20 bg-zinc-300" />
                </div>
                <div className="flex justify-between items-center p-2">
                  <Skeleton className="h-4 w-36 bg-zinc-300" />
                  <Skeleton className="h-4 w-28 bg-zinc-300" />
                </div>
              </div>
              <div className="border-t-2 border-dashed border-zinc-900 my-5" />
              <div className="flex flex-col items-end text-lg space-y-2">
                <div className="flex items-center gap-x-2">
                  <Skeleton className="h-4 w-16 bg-zinc-300" />
                  <Skeleton className="h-4 w-12 bg-zinc-300" />
                </div>
                <div className="flex gap-x-2">
                  <Skeleton className="h-6 w-12 bg-zinc-300" />
                  <Skeleton className="h-8 w-24 bg-zinc-300" />
                </div>
              </div>
            </>
          ) : (
            <>
              {proposal?.services.map(service => (
                <div
                  key={service.name}
                  className="flex justify-between items-center p-2"
                >
                  <h3 className="font-semibold w-8/12">{service.name}</h3>
                  <p className="text-lg">
                    {formaterPrice.format(parseInt(service.price))}
                  </p>
                </div>
              ))}
              <div className="border-t-2 border-dashed border-zinc-900 my-5" />
              <div className="flex flex-col items-end text-lg">
                <div className="flex items-center gap-x-2">
                  <p className="font-light text-zinc-400">Desconto</p>
                  <p className="font-bold text-red-500">
                    - {proposal?.discount}%
                  </p>
                </div>
                <div className="flex gap-x-2">
                  <h3 className="font-semibold text-xl">Total</h3>
                  <p className="text-3xl">
                    {formaterPrice.format(
                      parseInt(proposal?.totalPrice || '0')
                    )}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
        <div className="w-full flex flex-col items-center mt-6 space-y-2">
          <Button
            className="w-9/12 font-semibold bg-green-500 cursor-pointer hover:bg-green-600"
            onClick={() => {
              if (proposalId) {
                handleAcceptProposal(proposalId)
                setModalOpen(true)
              }
            }}
          >
            Aceitar proposta
          </Button>
          <Button
            className="w-9/12 font-semibold bg-red-500 cursor-pointer hover:bg-red-600"
            onClick={() => {
              if (proposalId) {
                handleRejectProposal(proposalId)
              }
            }}
          >
            Recusar proposta
          </Button>
        </div>
      </div>
      <AlertDialog open={modalOpen} onOpenChange={setModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Proposta aceita com sucesso!</AlertDialogTitle>
            <AlertDialogDescription>
              Em breve entraremos em contato para os próximos passos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Link to="/">
              <AlertDialogAction className="cursor-pointer">
                Ir até nosso site
              </AlertDialogAction>
            </Link>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Proposta recusada</AlertDialogTitle>
            <AlertDialogDescription>
              Tudo bem! Em breve entraremos em contato para esclarecer. Visite
              nosso site.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Link to="/">
              <AlertDialogAction className="cursor-pointer">
                Visitar nosso site
              </AlertDialogAction>
            </Link>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
