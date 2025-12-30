import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import {
  createProposal,
  fetchManyServices,
  getCustomerById,
  getLastDraftProposal,
  type CreateProposalBody,
  type CreateProposalBodyServicesItem,
} from '@/http/api'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link, useParams } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { useId, useState } from 'react'
import { useForm } from 'react-hook-form'
import { ProposalStatusModal } from './-components/proposal-status-modal'
import {
  SelectServicesWithPrice,
  type ServiceItem,
} from './-components/select-services-with-price'

export const Route = createFileRoute(
  '/_authenticated/_create-proposal/$new-proposal'
)({
  component: RouteComponent,
})

function RouteComponent() {
  const { 'new-proposal': customerId } = useParams({ strict: false })
  const percentageId = useId()

  const [selectedServices, setSelectedServices] = useState<ServiceItem[]>([])
  const [discountType, setDiscountType] = useState<'percentage'>('percentage')
  const [modalState, setModalState] = useState({
    isOpen: false,
    isLoading: false,
    isSuccess: false,
    error: undefined as string | undefined,
  })

  // 🚀 TanStack Query para buscar o cliente
  const { data: customerData } = useQuery({
    queryKey: ['customer', customerId],
    queryFn: async () => {
      if (!customerId) return null
      const response = await getCustomerById(customerId)
      return response.customer
    },
    enabled: !!customerId,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  })

  // 🚀 TanStack Query para buscar os serviços
  const { data: servicesData } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const response = await fetchManyServices()
      return response.services
    },
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  })

  // 🚀 TanStack Query para buscar o último draft
  const { data: draftProposal } = useQuery({
    queryKey: ['draftProposal', customerId],
    queryFn: () => {
      if (!customerId) throw new Error('Customer ID is required')
      return getLastDraftProposal(customerId)
    },
    enabled: !!customerId,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    select: (data) => data.proposalDraft, // 🎯 Extrai apenas o proposalDraft
  })

  const customer = customerData
  const services = servicesData || []

  // 🎯 useForm com values vindos do draft (atualiza automaticamente)
  const { register, handleSubmit } = useForm<CreateProposalBody>({
    values: draftProposal ? {
      title: draftProposal.title || '',
      welcomeDescription: draftProposal.welcomeDescription || '',
      whyUs: draftProposal.whyUs || '',
      challenge: draftProposal.challenge || '',
      solution: draftProposal.solution || '',
      results: draftProposal.results || '',
    } as Partial<CreateProposalBody> as CreateProposalBody : undefined,
  })

  function handleServicesChange(services: ServiceItem[]) {
    setSelectedServices(services)
  }

  async function onSubmit(data: CreateProposalBody) {
    // Validações antes de enviar
    if (!customerId) {
      alert('ID do cliente não encontrado')
      return
    }

    if (selectedServices.length === 0) {
      alert('Selecione pelo menos um serviço')
      return
    }

    // Abre o modal de loading
    setModalState({
      isOpen: true,
      isLoading: true,
      isSuccess: false,
      error: undefined,
    })

    try {
      // Converte os serviços selecionados para o formato esperado pela API
      const apiServices: CreateProposalBodyServicesItem[] = selectedServices
        .filter(service => service.serviceId && service.value)
        .map(service => ({
          servicesId: service.serviceId,
          price: parseFloat(service.value) || 0,
        }))

      if (apiServices.length === 0) {
        throw new Error('Nenhum serviço válido selecionado')
      }

      const formData: CreateProposalBody = {
        urlLogoImage: null, // Por enquanto null, futuramente implementar upload
        title: data.title,
        customersId: customerId, // Garantido que não é undefined pela validação acima
        welcomeDescription: data.welcomeDescription,
        whyUs: data.whyUs,
        challenge: data.challenge,
        solution: data.solution,
        services: apiServices,
        results: data.results,
        discount: parseFloat(data.discount?.toString() || '0') || 0,
      }

      await createProposal(formData)

      // Sucesso
      setModalState({
        isOpen: true,
        isLoading: false,
        isSuccess: true,
        error: undefined,
      })
    } catch (error) {
      console.error('Erro ao criar proposta:', error)
      setModalState({
        isOpen: true,
        isLoading: false,
        isSuccess: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      })
    }
  }

  function handleCloseModal() {
    setModalState({
      isOpen: false,
      isLoading: false,
      isSuccess: false,
      error: undefined,
    })
  }

  return (
    <div className="w-full">
      <div className="flex w-full">
        <Link to="/select-costumer">
          <ArrowLeft className="cursor-pointer" />
        </Link>
        <div className="w-full flex justify-center font-semibold text-2xl">
          <h1>Criar proposta</h1>
        </div>
      </div>
      <div className="flex justify-center">
        <form
          className="space-y-4 mt-4 max-w-xl w-full"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Input {...register('title')} placeholder="Título da proposta" />
          <Input
            {...register('customersId')}
            placeholder="Nome do cliente"
            value={customer?.name || ''}
            disabled={true}
          />
          <Textarea
            {...register('welcomeDescription')}
            placeholder="Descrição de boas-vindas"
          />
          <Textarea
            {...register('whyUs')}
            placeholder="Descrição de porque nós"
          />
          <Textarea
            {...register('challenge')}
            placeholder="Descrição do desafio que precisa resolver"
          />
          <Textarea
            {...register('solution')}
            placeholder="Descrição da solução proposta"
          />
          <SelectServicesWithPrice
            services={services}
            onServicesChange={handleServicesChange}
          />
          <Textarea
            {...register('results')}
            placeholder="Descrição dos resultados esperados"
          />

          <div className="space-y-3">
            <Label className="text-base font-medium">Tipo de desconto</Label>
            <RadioGroup
              value={discountType}
              onValueChange={value => setDiscountType(value as 'percentage')}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="percentage" id={percentageId} />
                <Label htmlFor={percentageId}>
                  Desconto por porcentagem (%)
                </Label>
              </div>
            </RadioGroup>

            {discountType === 'percentage' && (
              <Input
                placeholder="Porcentagem de desconto (ex: 10)"
                type="number"
                min="0"
                max="100"
                step="0.01"
                {...register('discount')}
              />
            )}
          </div>

          <Button type="submit" className="w-full" variant={'outline'}>
            Criar proposta
          </Button>
        </form>
      </div>

      <ProposalStatusModal
        isOpen={modalState.isOpen}
        isLoading={modalState.isLoading}
        isSuccess={modalState.isSuccess}
        error={modalState.error}
        onClose={handleCloseModal}
      />
    </div>
  )
}
