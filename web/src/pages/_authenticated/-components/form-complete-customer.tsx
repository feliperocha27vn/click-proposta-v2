import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  type CompleteRegisterBody,
  type GetDataForPayment200,
  completeRegister,
  createNewPayment,
  getDataForPayment,
} from '@/http/api'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

interface FormCompleteCustomerProps {
  isOpen: boolean
  onClose: () => void
  customerName?: string
  isRegisterComplete?: boolean
  selectedPlan?: 'free' | 'pro'
}

export default function FormCompleteCustomer({
  isOpen,
  onClose,
  customerName,
  isRegisterComplete = false,
  selectedPlan = 'free',
}: FormCompleteCustomerProps) {
  const { register, handleSubmit, reset } = useForm<CompleteRegisterBody>()
  const [currentStep, setCurrentStep] = useState<
    'complete-register' | 'payment' | 'payment-url'
  >('complete-register')
  const [dataUserPayment, setDataUserPayment] = useState<GetDataForPayment200>()
  const [urlPayment, setUrlPayment] = useState<string>()
  const [loadingPayment, setLoadingPayment] = useState(false)

  useEffect(() => {
    getDataForPayment()
      .then(reply => {
        setDataUserPayment(reply)
      })
      .catch(error => {
        console.error('Erro ao obter dados para pagamento:', error)
      })
  }, [])

  // Atualiza o step sempre que isRegisterComplete mudar
  useEffect(() => {
    if (isRegisterComplete) {
      setCurrentStep('payment')
    } else {
      setCurrentStep('complete-register')
    }
  }, [isRegisterComplete])

  async function onSubmit(data: CompleteRegisterBody) {
    await completeRegister(data)

    setCurrentStep('payment')
  }

  function handleClose() {
    onClose()
    reset()
    setUrlPayment(undefined)
    setLoadingPayment(false)
    // Reset do passo baseado no status atual do registro
    if (isRegisterComplete) {
      setCurrentStep('payment')
    } else {
      setCurrentStep('complete-register')
    }
  }

  async function handlePayment() {
    if (!dataUserPayment) {
      console.error('❌ Dados do usuário não carregados ainda')
      return
    }

    setLoadingPayment(true)

    try {
      console.log('💳 Iniciando pagamento com dados:', dataUserPayment)
      const reply = await createNewPayment({
        price: 999,
        customer: {
          cellphone: dataUserPayment.phone,
          cpf: dataUserPayment.cpf,
          email: dataUserPayment.email,
          name: dataUserPayment.name,
        },
      })
      console.log('✅ Pagamento criado:', reply)

      // Armazena a URL de pagamento e vai para o próximo step
      setUrlPayment(reply) // A API retorna diretamente a URL como string
      setCurrentStep('payment-url')
    } catch (error) {
      console.error('❌ Erro ao criar pagamento:', error)
    } finally {
      setLoadingPayment(false)
    }
  }

  // Componente do passo de completar cadastro
  const renderCompleteRegisterStep = () => (
    <>
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
            className="peer"
            placeholder="Telefone"
            type="tel"
            aria-label="Telefone"
            {...register('phone', { required: true })}
          />
          <Input
            className="peer"
            placeholder="CPF"
            type="text"
            aria-label="CPF"
            {...register('cpf', { required: true })}
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
            Continuar
          </Button>
        </div>
      </form>
    </>
  )

  // Componente do passo de pagamento
  const renderPaymentStep = () => (
    <>
      <div className="mb-2 flex flex-col items-center gap-2">
        <DialogHeader>
          <DialogTitle className="sm:text-center">
            Finalizar assinatura
          </DialogTitle>
        </DialogHeader>
      </div>

      <div className="space-y-5 text-center">
        <div className="text-center">
          <h3 className="text-lg font-semibold">
            Plano {selectedPlan === 'pro' ? 'Pro' : 'Grátis'}
          </h3>
          <p className="text-2xl font-bold">
            {selectedPlan === 'pro' ? 'R$ 9,99 / mês' : 'R$ 0 / mês'}
          </p>
          {customerName && (
            <p className="text-sm text-muted-foreground mt-2">
              Olá, {customerName}! Você está pronto para finalizar sua
              assinatura.
            </p>
          )}
        </div>

        {selectedPlan === 'pro' && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">
              Você será direcionado para nossa plataforma de pagamento segura.
            </p>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            className="flex-1 cursor-pointer"
            onClick={handleClose}
          >
            Cancelar
          </Button>
          <Button
            className="flex-1 cursor-pointer"
            onClick={handlePayment}
            disabled={loadingPayment}
          >
            {loadingPayment
              ? 'Processando...'
              : selectedPlan === 'pro'
                ? 'Pagar agora'
                : 'Ativar plano grátis'}
          </Button>
        </div>
      </div>
    </>
  )

  // Componente do passo de URL de pagamento
  const renderPaymentUrlStep = () => (
    <>
      <div className="mb-2 flex flex-col items-center gap-2">
        <DialogHeader>
          <DialogTitle className="sm:text-center">
            Finalizar Pagamento
          </DialogTitle>
        </DialogHeader>
      </div>

      <div className="space-y-5 text-center">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-label="Sucesso"
            >
              <title>Sucesso</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">Quase lá! 🎉</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Clique no botão abaixo para ser redirecionado para nossa plataforma
            de pagamento segura e finalizar sua assinatura.
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Plano {selectedPlan === 'pro' ? 'Pro' : 'Grátis'}:</strong>{' '}
            {selectedPlan === 'pro' ? 'R$ 9,99/mês' : 'Gratuito'}
          </p>
          <p className="text-xs text-blue-600 mt-1">
            Pagamento processado de forma 100% segura
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            className="flex-1 cursor-pointer"
            onClick={handleClose}
          >
            Fechar
          </Button>
          <Button
            className="flex-1 cursor-pointer bg-green-600 hover:bg-green-700"
            onClick={() => {
              if (urlPayment) {
                window.open(urlPayment, '_blank')
              }
            }}
            disabled={!urlPayment}
          >
            💳 Ir para Pagamento
          </Button>
        </div>

        {urlPayment && (
          <p className="text-xs text-gray-500 mt-2">
            Você pode fechar esta janela após ser redirecionado
          </p>
        )}
      </div>
    </>
  )

  return (
    <Dialog
      open={isOpen}
      onOpenChange={open => {
        if (!open) {
          handleClose()
        }
      }}
    >
      <DialogContent>
        {currentStep === 'complete-register' && renderCompleteRegisterStep()}
        {currentStep === 'payment' && renderPaymentStep()}
        {currentStep === 'payment-url' && renderPaymentUrlStep()}
      </DialogContent>
    </Dialog>
  )
}
