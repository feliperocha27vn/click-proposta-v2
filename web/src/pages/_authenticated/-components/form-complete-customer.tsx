import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { type CompleteRegisterBody, completeRegister } from '@/http/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react'
import { useState } from 'react'
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
  const [step, setStep] = useState<1 | 2>(1)
  const { register, handleSubmit, reset, trigger } =
    useForm<CompleteRegisterBody>()
  const queryClient = useQueryClient()

  const { mutateAsync: submitRegister, isPending } = useMutation({
    mutationFn: (data: CompleteRegisterBody) =>
      completeRegister({
        ...data,
        cpf: data.cpf.replace(/\D/g, ''),
        cnpj: data.cnpj ? data.cnpj.replace(/\D/g, '') : undefined,
      }),
    onSuccess: () => {
      queryClient.setQueryData(['complete-register'], {
        isRegisterComplete: true,
      })
      reset()
      setStep(1)
      onClose()
    },
  })

  async function onSubmit(data: CompleteRegisterBody) {
    await submitRegister(data)
  }

  const handleNextStep = async () => {
    const isStepValid = await trigger(['phone', 'cpf'])
    if (isStepValid) {
      setStep(2)
    }
  }

  return (
    <Dialog open={isOpen}>
      <DialogContent
        hideClose
        className="sm:max-w-106.25 p-0 overflow-hidden gap-0"
      >
        {/* Header Visual com Progresso */}
        <div className="bg-slate-50 border-b border-slate-100 p-6 pb-4">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-900">
              Vamos configurar seu perfil
            </DialogTitle>
            <DialogDescription className="text-slate-500 mt-2">
              {step === 1
                ? 'Preencha seus dados básicos para começarmos.'
                : 'Seu endereço será usado para gerar propostas em PDF.'}
            </DialogDescription>
          </DialogHeader>

          {/* Stepper Indicator */}
          <div className="flex items-center gap-2 mt-6">
            <div
              className={`h-1.5 flex-1 rounded-full ${step >= 1 ? 'bg-emerald-500' : 'bg-slate-200'} transition-all duration-300`}
            />
            <div
              className={`h-1.5 flex-1 rounded-full ${step >= 2 ? 'bg-emerald-500' : 'bg-slate-200'} transition-all duration-300`}
            />
          </div>
          <div className="flex justify-between text-xs font-medium text-slate-400 mt-2 px-1">
            <span className={step >= 1 ? 'text-emerald-600' : ''}>
              Dados Pessoais
            </span>
            <span className={step >= 2 ? 'text-emerald-600' : ''}>
              Dados de Endereço
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          <div className="relative overflow-hidden">
            {/* Passo 1: Dados Pessoais */}
            <div
              className={`space-y-4 transition-all duration-300 ease-in-out ${step === 1 ? 'block opacity-100 translate-x-0' : 'hidden opacity-0 -translate-x-full'}`}
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone / WhatsApp</Label>
                  <Input
                    id="phone"
                    placeholder="(00) 00000-0000"
                    type="tel"
                    {...register('phone', { required: true })}
                    className="focus-visible:ring-emerald-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF</Label>
                  <Input
                    id="cpf"
                    placeholder="000.000.000-00"
                    type="text"
                    {...register('cpf', { required: true })}
                    className="focus-visible:ring-emerald-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="cnpj"
                    className="flex items-baseline justify-between"
                  >
                    <span>CNPJ</span>
                    <span className="text-xs text-slate-400 font-normal">
                      (Opcional)
                    </span>
                  </Label>
                  <Input
                    id="cnpj"
                    placeholder="00.000.000/0000-00"
                    type="text"
                    {...register('cnpj', { required: false })}
                    className="focus-visible:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-4">
                <Button
                  type="button"
                  onClick={handleNextStep}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-11 transition-all flex items-center justify-center gap-2 group"
                >
                  Continuar
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>

            {/* Passo 2: Endereço */}
            <div
              className={`space-y-4 transition-all duration-300 ease-in-out ${step === 2 ? 'block opacity-100 translate-x-0' : 'hidden opacity-0 translate-x-full absolute top-0 w-full'}`}
            >
              <div className="space-y-4">
                <div className="grid grid-cols-[1fr_90px] gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="street">Rua / Avenida</Label>
                    <Input
                      id="street"
                      placeholder="Ex: Av. Paulista"
                      {...register('street', { required: step === 2 })}
                      className="focus-visible:ring-emerald-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="number">Número</Label>
                    <Input
                      id="number"
                      placeholder="1000"
                      {...register('number', { required: step === 2 })}
                      className="focus-visible:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="neighborhood">Bairro</Label>
                  <Input
                    id="neighborhood"
                    placeholder="Ex: Centro"
                    {...register('neighborhood', { required: step === 2 })}
                    className="focus-visible:ring-emerald-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">Cidade / Estado</Label>
                  <Input
                    id="city"
                    placeholder="Ex: São Paulo - SP"
                    {...register('city', { required: step === 2 })}
                    className="focus-visible:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  disabled={isPending}
                  className="rounded-xl h-11 px-4 text-slate-500 hover:text-slate-700"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-11 transition-all shadow-lg shadow-emerald-200 flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {isPending ? 'Salvando...' : 'Finalizar Cadastro'}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
