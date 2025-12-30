import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  getMe,
  getProposalById,
  type GetProposalById200,
  type UpdateProposalBody,
} from '@/http/api'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, useParams } from '@tanstack/react-router'
import { Edit3 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { env } from '../../../../env'
import Logo from '../../../assets/logo.png'
import { FormEditProposal } from './-components/form-edit-proposal'

export const Route = createFileRoute('/_authenticated/proposal/$proposal-id')({
  component: RouteComponent,
})

function RouteComponent() {
  const { 'proposal-id': proposalId } = useParams({ strict: false })
  const [proposal, setProposal] = useState<GetProposalById200>()
  const [loading, setLoading] = useState(true)
  const [editModal, setEditModal] = useState<{
    isOpen: boolean
    field: keyof UpdateProposalBody | null
    currentValue: string
    fieldLabel: string
  }>({
    isOpen: false,
    field: null,
    currentValue: '',
    fieldLabel: '',
  })

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: getMe,
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

  function handleEditClick(
    field: keyof UpdateProposalBody,
    currentValue: string | undefined,
    fieldLabel: string
  ) {
    setEditModal({
      isOpen: true,
      field,
      currentValue: currentValue || '',
      fieldLabel,
    })
  }

  function handleCloseEditModal() {
    setEditModal({
      isOpen: false,
      field: null,
      currentValue: '',
      fieldLabel: '',
    })
  }

  function handleUpdateField(
    field: keyof UpdateProposalBody,
    newValue: string
  ) {
    if (proposal) {
      setProposal({
        ...proposal,
        [field]: newValue,
      })
    }
  }

  const shareData = {
    title: `${proposal?.title} - Click Proposta`,
    text: 'Confira minhas propostas!',
    url: `${env.VITE_APP_URL}/public-proposal/${proposalId}?plan=${user?.user.plan}`,
  }

  async function handleShare() {
    try {
      await navigator.share(shareData)
    } catch (error) {
      console.error('Erro ao compartilhar:', error)
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div className="max-w-2xl min-h-screen flex flex-col items-center p-4">
        <div className="w-full flex space-x-4 justify-center items-center p-4 border-b">
          <img
            src={Logo}
            alt="Logo da Click Proposta"
            className={`w-26 ${user?.user.plan === 'PRO' ? 'hidden' : 'opacity-30'}`}
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
                <div className="group relative flex">
                  <p>{proposal?.welcomeDescription}</p>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="top-0 right-0 opacity-60 hover:opacity-100 transition-opacity h-6 w-6 p-0 bg-white/80 hover:bg-white border border-zinc-200"
                    onClick={() =>
                      handleEditClick(
                        'welcomeDescription',
                        proposal?.welcomeDescription ?? undefined,
                        'Descrição de boas-vindas'
                      )
                    }
                  >
                    <Edit3 className="h-3 w-3" />
                  </Button>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 group">
                    <h2 className="text-lg font-semibold">
                      Nosso principal desafio
                    </h2>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="opacity-60 hover:opacity-100 transition-opacity h-6 w-6 p-0 bg-white/80 hover:bg-white border border-zinc-200"
                      onClick={() =>
                        handleEditClick(
                          'challenge',
                          proposal?.challenge ?? undefined,
                          'Nosso principal desafio'
                        )
                      }
                    >
                      <Edit3 className="h-3 w-3" />
                    </Button>
                  </div>
                  <p>{proposal?.challenge}</p>
                </div>
                <div className="bg-zinc-50 rounded-lg p-4 shadow">
                  <div className="flex items-center gap-2 group mb-2">
                    <h2 className="font-semibold text-lg">Nossa solução</h2>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="opacity-60 hover:opacity-100 transition-opacity h-6 w-6 p-0 bg-white/80 hover:bg-white border border-zinc-200"
                      onClick={() =>
                        handleEditClick(
                          'solution',
                          proposal?.solution ?? undefined,
                          'Nossa solução'
                        )
                      }
                    >
                      <Edit3 className="h-3 w-3" />
                    </Button>
                  </div>
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
                <div className="flex items-center justify-center gap-2 group">
                  <h2 className="text-lg text-center font-semibold">
                    Serviços e Investimentos
                  </h2>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                  >
                    <Edit3 className="h-3 w-3" />
                  </Button>
                </div>
                <div className="space-y-3 mt-4">
                  <div className="flex items-center gap-2 group">
                    <h2 className="text-lg font-semibold">Porque nós?</h2>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="opacity-60 hover:opacity-100 transition-opacity h-6 w-6 p-0 bg-white/80 hover:bg-white border border-zinc-200"
                      onClick={() =>
                        handleEditClick(
                          'whyUs',
                          proposal?.whyUs ?? undefined,
                          'Porque nós?'
                        )
                      }
                    >
                      <Edit3 className="h-3 w-3" />
                    </Button>
                  </div>
                  <p>{proposal?.whyUs}</p>
                </div>
                <div className="space-y-3 mt-4">
                  <div className="flex items-center gap-2 group">
                    <h2 className="text-lg font-semibold">
                      Resultados Esperados
                    </h2>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="opacity-60 hover:opacity-100 transition-opacity h-6 w-6 p-0 bg-white/80 hover:bg-white border border-zinc-200"
                      onClick={() =>
                        handleEditClick(
                          'results',
                          proposal?.results ?? undefined,
                          'Resultados Esperados'
                        )
                      }
                    >
                      <Edit3 className="h-3 w-3" />
                    </Button>
                  </div>
                  <p>{proposal?.results}</p>
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
        <div className="bg-pink-700 text-white w-full p-6 flex flex-col items-center space-y-4 rounded-2xl text-center my-10">
          {loading ? (
            <>
              <Skeleton className="h-6 w-20 bg-pink-600" />
              <Skeleton className="h-4 w-72 bg-pink-600" />
              <Skeleton className="h-12 w-full bg-pink-600 rounded-lg" />
            </>
          ) : (
            <>
              <h1>Quase lá!</h1>
              <p>Revise sua proposta ou envie diretamente para o cliente.</p>
              <Button
                className="w-full bg-white text-pink-700 font-semibold text-xl py-5 cursor-pointer"
                variant={'secondary'}
                onClick={handleShare}
              >
                Enviar Proposta
              </Button>
            </>
          )}
        </div>
      </div>

      {editModal.isOpen && editModal.field && proposalId && (
        <FormEditProposal
          isOpen={editModal.isOpen}
          onClose={handleCloseEditModal}
          proposalId={proposalId}
          field={editModal.field}
          currentValue={editModal.currentValue}
          fieldLabel={editModal.fieldLabel}
          onUpdate={handleUpdateField}
        />
      )}
    </div>
  )
}
