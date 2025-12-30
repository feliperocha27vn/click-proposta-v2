import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  type FetchManyServices200ServicesItem,
  fetchManyServices,
  getCustomerById,
  getMe,
} from '@/http/api'
import { generatePdf } from '@/http/generate-pdf'
import { useMutation, useQuery } from '@tanstack/react-query'
import { createFileRoute, Link, useParams } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { DialogServicesDetail } from './-components/dialog-services-detail'

export const Route = createFileRoute(
  '/_authenticated/budget-civil/$customer-id'
)({
  component: RouteComponent,
})

interface ServiceItem {
  id: string
  name: string
  description: string
}

interface ServicesForm {
  service: ServiceItem[]
  total: string
}

function RouteComponent() {
  const { register, handleSubmit, control } = useForm<ServicesForm>({
    defaultValues: {
      service: [],
      total: '',
    },
  })
  const { 'customer-id': customerId } = useParams({ strict: false })
  const [closeDialog, setCloseDialog] = useState(false)

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

  const { fields, append } = useFieldArray({
    control,
    name: 'service',
  })

  function handleSelectService(data: FetchManyServices200ServicesItem) {
    const exists = fields.some(field => field.id === data.id)
    if (!exists) {
      append({
        id: data.id,
        name: data.name || '',
        description: data.description || '',
      })
    }
    setCloseDialog(false)
  }

  const { mutate: generatePdfFn, isPending } = useMutation({
    mutationFn: generatePdf,
  })

  function handleSubmitForm(data: ServicesForm) {
    generatePdfFn({
      imgUrl: user?.user.avatarUrl || '',
      services: data.service,
      nameUser: user?.user.name || '',
      nameCustomer: customer?.customer.name || '',
      emailCustomer: customer?.customer.email || '',
      phoneCustomer: customer?.customer.phone || '',
      total: data.total,
    })
  }

  return (
    <>
      <div className="w-1/12 xl:hidden">
        <Link to="/select-type-proposal">
          <ArrowLeft />
        </Link>
      </div>
      <div className="mt-4 flex flex-col gap-x-2">
        <form className="space-y-2" onSubmit={handleSubmit(handleSubmitForm)}>
          <div className="flex items-center gap-x-2">
            <img
              className="size-32"
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
                    <Textarea {...register(`service.${index}.name`)} />
                    <span className="font-light">Descrição</span>
                    <Textarea {...register(`service.${index}.description`)} />
                  </div>
                </div>
              </div>
            ))}
            <Input
              placeholder="Total do orçamento"
              {...register('total')}
              className="w-11/12"
            />
            <DialogServicesDetail
              closeDialog={closeDialog}
              setCloseDialog={setCloseDialog}
              servicesData={servicesData || []}
              handleSelectService={handleSelectService}
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            variant="secondary"
            disabled={isPending}
          >
            {isPending ? 'Gerando PDF...' : 'Baixar PDF e salvar orçamento'}
          </Button>
        </form>
      </div>
    </>
  )
}
