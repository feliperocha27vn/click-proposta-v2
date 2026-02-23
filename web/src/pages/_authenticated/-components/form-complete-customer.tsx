import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { type CompleteRegisterBody, completeRegister } from '@/http/api'
import { useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'

interface FormCompleteCustomerProps {
  isOpen: boolean
  onClose: () => void
  customerName?: string
  isRegisterComplete?: boolean
  selectedPlan?: string
}

export default function FormCompleteCustomer({
  isOpen,
  onClose,
  customerName: _customerName,
  isRegisterComplete: _isRegisterComplete,
  selectedPlan: _selectedPlan,
}: FormCompleteCustomerProps) {
  const { register, handleSubmit, reset } = useForm<CompleteRegisterBody>()
  const queryClient = useQueryClient()

  async function onSubmit(data: CompleteRegisterBody) {
    await completeRegister({
      ...data,
      cpf: data.cpf.replace(/\D/g, ''),
      cnpj: data.cnpj ? data.cnpj.replace(/\D/g, '') : undefined,
    })

    queryClient.setQueryData(['complete-register'], {
      isRegisterComplete: true,
    })
    reset()
    onClose()
  }

  return (
    <Dialog open={isOpen}>
      <DialogContent hideClose>
        <div className="mb-2 flex flex-col items-center gap-2">
          <DialogHeader>
            <DialogTitle className="sm:text-center">
              Completar cadastro
            </DialogTitle>
          </DialogHeader>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-3">
            <Input
              placeholder="Telefone"
              type="tel"
              aria-label="Telefone"
              {...register('phone', { required: true })}
            />
            <Input
              placeholder="CPF"
              type="text"
              aria-label="CPF"
              {...register('cpf', { required: true })}
            />
            <label htmlFor="cnpj">Caso tenha CNPJ, insira aqui</label>
            <Input
              placeholder="CNPJ"
              type="text"
              aria-label="CNPJ"
              {...register('cnpj', { required: false })}
            />
          </div>
          <Button type="submit" className="w-full cursor-pointer">
            Finalizar cadastro
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
