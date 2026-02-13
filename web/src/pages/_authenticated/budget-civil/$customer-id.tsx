import { generatePdf } from '@/api/generate-pdf'
import { BackButton } from '@/components/back-button'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  type FetchManyServices200ServicesItem,
  type PostBudgetsBody,
  fetchManyServices,
  getCustomerById,
  getMe,
  postBudgets,
} from '@/http/api'
import { useMutation, useQuery } from '@tanstack/react-query'
import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router'
import { useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { AlertCreateService } from '../-components/alerts-create-service'
import { DialogServicesDetail } from './-components/dialog-services-detail'

export const Route = createFileRoute(
  '/_authenticated/budget-civil/$customer-id'
)({
  component: RouteComponent,
})

function RouteComponent() {
  const { register, handleSubmit, control, getValues } =
    useForm<PostBudgetsBody>({
      defaultValues: {
        customerId: '',
        userId: '',
        total: 0,
        services: [],
      },
    })
  const { 'customer-id': customerId } = useParams({ strict: false })
  const [closeDialog, setCloseDialog] = useState(false)
  const navigate = useNavigate()

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: getMe,
  })

  const { data: customer } = useQuery({
    queryKey: ['customer', customerId],
    queryFn: () => getCustomerById(customerId || ''),
  })

  const { data: servicesData } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const response = await fetchManyServices()
      return response.services
    },
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  })

  const { mutate: generatePdfFn, isPending } = useMutation({
    mutationFn: generatePdf,
  })

  const {
    mutate: createBudgetFn,
    isPending: isPendingCreateBudget,
    isSuccess,
  } = useMutation({
    mutationFn: postBudgets,
  })

  const { fields, append } = useFieldArray({
    control,
    name: 'services',
  })

  function handleSelectService(data: FetchManyServices200ServicesItem) {
    const exists = fields.some(field => field.id === data.id)
    if (!exists) {
      append({
        id: data.id,
        title: data.name || '',
        description: data.description || '',
      })
    }
    setCloseDialog(false)
  }

  function handleGeneratePdf(data: PostBudgetsBody) {
    generatePdfFn({
      imgUrl: user?.user.avatarUrl || '',
      services: data.services.map(service => ({
        ...service,
        budgetsId: null,
      })),
      nameUser: user?.user.name || '',
      nameCustomer: customer?.customer.name || '',
      emailCustomer: customer?.customer.email || '',
      phoneCustomer: customer?.customer.phone || '',
      total: String(data.total),
    })
  }

  function handleSubmitForm(data: PostBudgetsBody) {
    createBudgetFn({
      customerId: customerId || '',
      userId: user?.user.id || '',
      total: data.total,
      services: data.services,
    })
  }

  return (
    <>
      <div className="xl:hidden">
        <BackButton to="/select-type-proposal" />
      </div>
      <div className="mt-4 flex flex-col gap-x-2 max-w-2xl mx-auto">
        <form className="space-y-2" onSubmit={handleSubmit(handleSubmitForm)}>
          <div className="flex items-center gap-x-2">
            <img
              className="size-24 rounded-2xl"
              src={user?.user.avatarUrl || ''}
              alt={`Logo da empresa ${user?.user.name || ''}`}
            />
            <div className="space-y-2">
              <h1 className="font-semibold">{user?.user.name}</h1>
            </div>
          </div>
          <div className="flex flex-col items-center text-center gap-y-4">
            <span className="h-px bg-zinc-200 w-full" />
            <h1 className="text-lg w-11/12 font-medium text-zinc-700">
              {customer?.customer.name}
            </h1>
            {fields.map((field, index) => (
              <div key={field.id} className="w-11/12 space-y-4">
                <h1 className="font-semibold font-lg text-start">
                  Item do orçamento
                </h1>
                <div className="w-full space-y-2">
                  <div>
                    <span className="font-light">Título</span>
                    <Textarea {...register(`services.${index}.title`)} />
                    <span className="font-light">Descrição</span>
                    <Textarea {...register(`services.${index}.description`)} />
                  </div>
                </div>
              </div>
            ))}
            <Input
              placeholder="Total do orçamento"
              {...register('total', { valueAsNumber: true })}
              className="w-11/12"
              type="number"
            />
            <DialogServicesDetail
              closeDialog={closeDialog}
              setCloseDialog={setCloseDialog}
              servicesData={servicesData || []}
              handleSelectService={handleSelectService}
            />
          </div>
          <Button
            className="w-full"
            type="submit"
            disabled={isPendingCreateBudget}
          >
            {isPendingCreateBudget
              ? 'Salvando orçamento...'
              : 'Salvar orçamento'}
          </Button>
          <Button
            type="button"
            className="w-full"
            variant="secondary"
            disabled={isPending}
            onClick={() => {
              const formData = getValues()
              handleGeneratePdf(formData)
            }}
          >
            {isPending ? 'Gerando PDF...' : 'Baixar PDF'}
          </Button>
        </form>
      </div>
      <AlertCreateService
        isOpen={isSuccess}
        onClose={() => { }}
        type="success"
        title="Sucesso"
        description="Orçamento salvo com sucesso"
        actionText="Ir para orçamentos salvos"
        onAction={() => {
          navigate({ to: '/proposals' })
        }}
      />
    </>
  )
}
