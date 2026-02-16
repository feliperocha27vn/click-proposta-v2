import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { type CreateNewCustomerBody, createNewCustomer } from '@/http/api'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { AlertCreateCustomer } from './alerts-create-customer.tsx'

interface CreateCustomerFormData {
  name: string
  email: string
  phone: string
}

interface FormCreateNewCustomerProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function FormCreateNewCustomer({
  isOpen,
  onClose,
  onSuccess,
}: FormCreateNewCustomerProps) {
  const [showAlert, setShowAlert] = useState(false)
  const [alertConfig, setAlertConfig] = useState({
    type: 'success' as 'success' | 'error',
    title: '',
    description: '',
    actionText: 'OK',
  })
  const { register, handleSubmit, reset } = useForm<CreateCustomerFormData>()

  async function onSubmit(data: CreateCustomerFormData) {
    try {
      const customerData: CreateNewCustomerBody = {
        name: data.name,
        email: data.email,
        phone: data.phone,
      }

      await createNewCustomer(customerData)

      setAlertConfig({
        type: 'success',
        title: 'Cliente criado com sucesso!',
        description: 'O cliente foi cadastrado com sucesso.',
        actionText: 'OK',
      })
      setShowAlert(true)
    } catch (error) {
      console.error('Erro ao criar cliente:', error)
      setAlertConfig({
        type: 'error',
        title: 'Erro ao criar cliente',
        description:
          'Ocorreu um erro ao tentar criar o cliente. Tente novamente.',
        actionText: 'OK',
      })
      setShowAlert(true)
    }
  }

  function handleAlertAction() {
    setShowAlert(false)
    if (alertConfig.type === 'success') {
      onSuccess()
      onClose()
      reset()
    }
  }

  function handleClose() {
    if (!showAlert) {
      onClose()
      reset()
    }
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={open => {
        if (!open && !showAlert) {
          handleClose()
        }
      }}
    >
      <DialogContent>
        <div className="mb-2 flex flex-col items-center gap-2">
          <DialogHeader>
            <DialogTitle className="sm:text-center">
              Criar novo cliente
            </DialogTitle>
            <DialogDescription className="sm:text-center">
              Preencha os dados do novo cliente.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-3">
            <Input
              className="peer"
              placeholder="Nome completo"
              type="text"
              aria-label="Nome do cliente"
              {...register('name', { required: true })}
            />
            <Input
              className="peer"
              placeholder="E-mail"
              type="email"
              aria-label="E-mail do cliente"
              {...register('email', { required: true })}
            />
            <Input
              className="peer"
              placeholder="Telefone"
              type="tel"
              aria-label="Telefone do cliente"
              {...register('phone', { required: true })}
            />
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1 cursor-pointer"
              onClick={handleClose}
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 cursor-pointer">
              Criar Cliente
            </Button>
          </div>
        </form>

        <AlertCreateCustomer
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
  )
}
