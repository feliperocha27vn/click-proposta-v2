import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  createService,
  fetchManyServices,
  type FetchManyServices200ServicesItem,
} from '@/http/api'
import { Plus, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { AlertCreateService } from '../../-components/alerts-create-service'

export interface ServiceItem {
  id: number
  serviceId: string
  value: string
}

interface CreateNewServiceFormData {
  name: string
  [key: string]: string
}

interface SelectServicesWithPriceProps {
  services: FetchManyServices200ServicesItem[]
  onServicesChange: (services: ServiceItem[]) => void
  initialServices?: ServiceItem[]
  onServiceCreated?: () => void
  onServicesUpdate?: (services: FetchManyServices200ServicesItem[]) => void
}

export function SelectServicesWithPrice({
  services,
  onServicesChange,
  initialServices,
  onServiceCreated,
  onServicesUpdate,
}: SelectServicesWithPriceProps) {
  const [selectedServices, setSelectedServices] = useState<ServiceItem[]>(
    initialServices || [{ id: Date.now(), serviceId: '', value: '' }]
  )
  const [inputsDescription, setInputsDescription] = useState<number[]>([])
  const [showAlert, setShowAlert] = useState(false)
  const [alertConfig, setAlertConfig] = useState({
    type: 'success' as 'success' | 'error',
    title: '',
    description: '',
    actionText: 'OK',
  })
  const { register, handleSubmit, reset } = useForm<CreateNewServiceFormData>()

  // Notifica o componente pai quando os serviços mudam
  useEffect(() => {
    onServicesChange(selectedServices)
  }, [selectedServices, onServicesChange])

  function handleAddService() {
    const newService = { id: Date.now(), serviceId: '', value: '' }
    setSelectedServices([...selectedServices, newService])
  }

  function handleRemoveService(id: number) {
    if (selectedServices.length > 1) {
      setSelectedServices(selectedServices.filter(service => service.id !== id))
    }
  }

  function handleServiceChange(
    id: number,
    field: 'serviceId' | 'value',
    value: string
  ) {
    setSelectedServices(
      selectedServices.map(service =>
        service.id === id ? { ...service, [field]: value } : service
      )
    )
  }

  function handleAddInput(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    e.stopPropagation()
    const newId = Date.now()
    setInputsDescription([...inputsDescription, newId])
  }

  async function onSubmit(data: CreateNewServiceFormData) {
    try {
      const descriptions = Object.keys(data)
        .filter(key => key.startsWith('description_'))
        .map(key => data[key])
        .filter(value => value && value.trim() !== '')

      const description = descriptions.join(';')

      const reply = await createService({
        name: data.name,
        description: description || undefined,
      })

      if (reply.statusCode === 201) {
        setAlertConfig({
          type: 'success',
          title: 'Serviço criado com sucesso!',
          description: 'Seu novo serviço foi cadastrado e já está disponível.',
          actionText: 'Confirmar',
        })
        setShowAlert(true)
        reset()
        setInputsDescription([])
      } else {
        setAlertConfig({
          type: 'error',
          title: 'Erro ao criar serviço',
          description:
            'Ocorreu um erro ao tentar criar o serviço. Tente novamente.',
          actionText: 'OK',
        })
        setShowAlert(true)
      }
    } catch (error) {
      console.error('Erro ao criar serviço:', error)
      setAlertConfig({
        type: 'error',
        title: 'Erro ao criar serviço',
        description: 'Ocorreu um erro inesperado. Tente novamente.',
        actionText: 'OK',
      })
      setShowAlert(true)
    }
  }

  async function handleAlertAction() {
    if (alertConfig.type === 'success') {
      setShowAlert(false)
      try {
        // Refetch dos serviços para atualizar a lista
        const updatedServices = await fetchManyServices()
        if (onServicesUpdate) {
          onServicesUpdate(updatedServices.services)
        }
        if (onServiceCreated) {
          onServiceCreated()
        }
      } catch (error) {
        console.error('Erro ao atualizar lista de serviços:', error)
      }
    } else {
      setShowAlert(false)
    }
  }

  return (
    <div className="space-y-4">
      <Label>Quais serviços serão oferecidos?</Label>

      {services.length === 0 ? (
        <div className="text-center py-8 space-y-4">
          <p className="text-gray-600">
            Você ainda não possui serviços cadastrados.
          </p>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="cursor-pointer">
                <Plus className="h-4 w-4 mr-2" />
                Cadastrar primeiro serviço
              </Button>
            </DialogTrigger>
            <DialogContent>
              <div className="mb-2 flex flex-col items-center gap-2">
                <DialogHeader>
                  <DialogTitle className="sm:text-center">
                    Crie um novo serviço
                  </DialogTitle>
                  <DialogDescription className="sm:text-center">
                    Preencha os detalhes do serviço.
                  </DialogDescription>
                </DialogHeader>
              </div>

              <form
                className="space-y-5"
                onSubmit={e => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleSubmit(onSubmit)(e)
                }}
              >
                <div className="*:not-first:mt-2">
                  <div className="relative space-y-3">
                    <Input
                      className="peer"
                      placeholder="Qual o nome do serviço?"
                      type="text"
                      aria-label="Nome do serviço"
                      {...register('name')}
                    />
                    <div className="flex gap-2 flex-col">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-light">
                          Gostaria de inserir algum detalhe sobre o serviço?
                        </p>
                        <Button
                          type="button"
                          onClick={handleAddInput}
                          className="cursor-pointer"
                        >
                          <Plus />
                        </Button>
                      </div>
                      {inputsDescription.map((id, index) => (
                        <Input
                          key={id}
                          placeholder="Detalhes do serviço"
                          {...register(`description_${index}`)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <Button type="submit" className="w-full cursor-pointer">
                  Criar Serviço
                </Button>
              </form>

              <AlertCreateService
                isOpen={showAlert}
                onClose={() => setShowAlert(false)}
                type={alertConfig.type}
                title={alertConfig.title}
                description={alertConfig.description}
                actionText={alertConfig.actionText}
                onAction={handleAlertAction}
              />
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        <>
          {selectedServices.map(serviceItem => (
            <div key={serviceItem.id} className="gap-2 space-y-2">
              <div className="flex-1">
                <Select
                  value={serviceItem.serviceId}
                  onValueChange={value =>
                    handleServiceChange(serviceItem.id, 'serviceId', value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o serviço" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map(service => (
                      <SelectItem key={service.id} value={service.id}>
                        {service.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2 w-full space-y-2">
                <div className="flex-1">
                  <Input
                    placeholder="Valor do serviço (R$)"
                    type="number"
                    step="0.01"
                    value={serviceItem.value}
                    onChange={e =>
                      handleServiceChange(
                        serviceItem.id,
                        'value',
                        e.target.value
                      )
                    }
                  />
                </div>

                {selectedServices.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveService(serviceItem.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}

          <div className="flex justify-between items-center">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleAddService}
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar outro serviço
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
