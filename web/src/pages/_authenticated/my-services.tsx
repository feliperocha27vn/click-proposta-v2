import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { deleteService, fetchManyServices, updateService, type FetchManyServices200ServicesItem } from '@/http/api'
import { createFileRoute } from '@tanstack/react-router'
import { Pen, Trash } from 'lucide-react'
import { useEffect, useState } from 'react'
import { AlertDeleteService } from './-components/alert-delete-service'
import FormCreateNewService from './-components/form-create-new-service'
import FormEditService from './-components/form-edit-service'
import { MenuMobileAuth } from './-components/menu-mobile'

export const Route = createFileRoute('/_authenticated/my-services')({
  component: RouteComponent,
})

function RouteComponent() {
  const [services, setServices] = useState<FetchManyServices200ServicesItem[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteAlert, setDeleteAlert] = useState({
    isOpen: false,
    serviceId: '',
    serviceName: ''
  })
  const [editModal, setEditModal] = useState({
    isOpen: false,
    service: null as FetchManyServices200ServicesItem | null
  })

  useEffect(() => {
    fetchManyServices().then(reply => {
      setServices(reply.services)
      setLoading(false)
    })
  }, [])

  function handleDeleteClick(serviceId: string, serviceName: string) {
    setDeleteAlert({
      isOpen: true,
      serviceId,
      serviceName
    })
  }

  function handleConfirmDelete() {
    // Aqui você pode adicionar a lógica de exclusão da API
    console.log(`Excluindo serviço: ${deleteAlert.serviceId}`)

    deleteService(deleteAlert.serviceId).then(() => {
      // Remove o serviço da lista local
      setServices(services.filter(service => service.id !== deleteAlert.serviceId))
    })

    // Fecha o alerta
    setDeleteAlert({
      isOpen: false,
      serviceId: '',
      serviceName: ''
    })
  }

  function handleCloseDeleteAlert() {
    setDeleteAlert({
      isOpen: false,
      serviceId: '',
      serviceName: ''
    })
  }

  function handleEditClick(service: FetchManyServices200ServicesItem) {
    setEditModal({
      isOpen: true,
      service
    })
  }

  function handleCloseEditModal() {
    setEditModal({
      isOpen: false,
      service: null
    })
  }

  async function handleUpdateService(serviceId: string, data: { name: string; description?: string }) {
    try {
      // Aqui você pode adicionar a chamada da API de update
      console.log('Atualizando serviço:', serviceId, data)

      await updateService(serviceId, {
        name: data.name,
        description: data.description || undefined
      }).then(() => // Atualiza o serviço na lista local
        setServices(services.map(service =>
          service.id === serviceId
            ? { ...service, name: data.name, description: data.description || null }
            : service
        )))

      // Não fecha o modal aqui - deixa o componente FormEditService controlar o fechamento

    } catch (error) {
      console.error('Erro ao atualizar serviço:', error)
      throw error
    }
  }

  return (
    <>
      <div className='flex items-center justify-between mb-4'>
        <div className='w-full space-y-4'>
          <div className='flex items-center justify-between'>
            <h1 className='text-2xl font-semibold'>Meus Serviços</h1>
            <MenuMobileAuth />
          </div>
          <FormCreateNewService />
        </div>
      </div>
      {loading ? (
        <div className="relative">
          <div className="space-y-6">
            <Skeleton className="mt-6 h-24 w-full bg-zinc-300 rounded-lg" />
            <Skeleton className="mt-6 h-24 w-full bg-zinc-300 rounded-lg opacity-80" />
            <Skeleton className="mt-6 h-24 w-full bg-zinc-300 rounded-lg opacity-60" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
        </div>
      ) : (
        services.map(service => {
          return (
            <div key={service.id} className='mt-6 space-y-2 bg-zinc-100 p-4 rounded-lg md:h-24 flex flex-col justify-between xl:w-full'>
              <h2 className='text-lg font-semibold'>{service.name}</h2>
              <div className='flex justify-between items-center'>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className='text-sm cursor-pointer'>Ver descrição</Button>
                  </DialogTrigger>
                  <DialogContent className="flex flex-col gap-0 p-0 sm:max-h-[min(640px,80vh)] sm:max-w-lg [&>button:last-child]:top-3.5">
                    <DialogHeader className="contents space-y-0 text-left">
                      <DialogTitle className="border-b px-6 py-4 text-base">
                        {service.name}
                      </DialogTitle>
                      <div className="overflow-y-auto">
                        <DialogDescription asChild>
                          <div className="px-6 py-4">
                            <div className="[&_strong]:text-foreground space-y-4 [&_strong]:font-semibold">
                              <div className="space-y-4">
                                {service.description ? service.description.split(';').map((item: string, index: number) => (
                                  <p key={`${service.id}-${index}`} className='text-sm text-zinc-600'>
                                    {item.trim()}
                                  </p>
                                )) : (
                                  <p className='text-sm text-zinc-600'>Nenhuma descrição disponível</p>
                                )}
                              </div>
                            </div>
                          </div>
                        </DialogDescription>
                        <DialogFooter className="px-6 pb-6 sm:justify-start">
                          <DialogClose asChild>
                            <Button type="button" className="cursor-pointer">Fechar</Button>
                          </DialogClose>
                        </DialogFooter>
                      </div>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
                <div className='space-x-2'>
                  <Button
                    className='cursor-pointer'
                    onClick={() => handleEditClick(service)}
                  >
                    <Pen />
                  </Button>
                  <Button
                    className='cursor-pointer bg-red-500 hover:bg-red-600'
                    onClick={() => handleDeleteClick(service.id, service.name)}
                  >
                    <Trash />
                  </Button>
                </div>
              </div>
            </div>
          )
        }))}

      <AlertDeleteService
        isOpen={deleteAlert.isOpen}
        onClose={handleCloseDeleteAlert}
        serviceName={deleteAlert.serviceName}
        onConfirm={handleConfirmDelete}
      />

      <FormEditService
        isOpen={editModal.isOpen}
        onClose={handleCloseEditModal}
        service={editModal.service}
        onUpdate={handleUpdateService}
      />
    </>
  )
}
