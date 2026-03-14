import { createFileRoute } from '@tanstack/react-router'
import { Check } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useAuth } from '@/contexts/auth-context'
import { useCreateNewPayment } from '@/gen/hooks/PaymentsHooks/useCreateNewPayment'
import { useGetCompleteRegister } from '@/gen/hooks/UsersHooks/useGetCompleteRegister'
import { getDataForPayment } from '@/gen/hooks/UsersHooks/useGetDataForPayment'
import { useGetMe } from '@/gen/hooks/UsersHooks/useGetMe'
import { AlertErrorModal } from './-components/alert-error-modal'
import FormCompleteCustomer from './-components/form-complete-customer'
import { LoadingValidationModal } from './-components/loading-validation-modal'

export const Route = createFileRoute('/_authenticated/plans')({
  component: RouteComponent,
})

function RouteComponent() {
  const { session } = useAuth()
  const [completeModal, setCompleteModal] = useState(false)
  const [errorModal, setErrorModal] = useState(false)
  const [loadingValidation, setLoadingValidation] = useState(false)

  const { data: isRegisterComplete } = useGetCompleteRegister()
  const { data: userDataResponse } = useGetMe()
  const userData = userDataResponse?.user

  const { mutateAsync: createNewPaymentMutate } = useCreateNewPayment()

  async function handleOpenProModal() {
    if (userData?.plan === 'PRO') return

    // Sempre mostra loading primeiro
    setLoadingValidation(true)

    try {
      // 1. Tenta buscar os dados para pagamento
      const userDataPayment = await getDataForPayment()

      // 2. Se chegou aqui, os dados estão completos (API retornou 200)
      // Gera o link de pagamento direto
      const checkoutUrl = await createNewPaymentMutate({
        data: {
          customer: {
            name: userDataPayment.name,
            email: userDataPayment.email,
            cellphone: userDataPayment.phone.replace(/\D/g, ''),
            cpf: userDataPayment.cpf.replace(/\D/g, ''),
          },
        },
      })

      // Redireciona para o Abacate Pay
      window.location.href = checkoutUrl
    } catch (error: unknown) {
      setLoadingValidation(false)

      const apiError = error as {
        response?: { status: number }
        status?: number
      }

      const status = apiError.response?.status || apiError.status

      // Se o erro for 422, significa que faltam dados cadastrais
      if (status === 422) {
        setCompleteModal(true)
      } else {
        setErrorModal(true)
      }

      console.error('Erro ao verificar registro ou gerar pagamento:', apiError)
    }
  }

  function handleCloseCompleteModal() {
    setCompleteModal(false)
  }

  return (
    <section className="py-16 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl space-y-6 text-center">
          <h1 className="text-center text-4xl font-semibold lg:text-5xl">
            Planos Simples e Transparentes
          </h1>
          <p>
            Chega de perder tempo com documentos complicados. Nossos planos são
            feitos para que você crie propostas profissionais em minutos,
            impressione seus clientes e foque no que realmente importa: seu
            trabalho.
          </p>
        </div>{' '}
        <div className="md:flex md:justify-center">
          <div className="mt-8 grid gap-6 md:mt-20 md:grid-cols-2 md:w-9/12">
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle className="font-medium">Grátis</CardTitle>
                <span className="my-3 block text-2xl font-semibold">
                  R$0 / mês
                </span>
              </CardHeader>

              <CardContent className="space-y-4">
                <hr className="border-dashed" />

                <ul className="list-outside space-y-3 text-sm">
                  {[
                    '2 Propostas / Orçamentos',
                    'Painel de gestão',
                    'Suporte por Email',
                  ].map(item => (
                    <li key={item} className="flex items-center gap-2">
                      <Check className="size-3" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="mt-auto">
                <Button variant="outline" className="w-full cursor-pointer">
                  Começar
                </Button>
              </CardFooter>
            </Card>

            <Card className="relative">
              <span className="bg-linear-to-br/increasing absolute inset-x-0 -top-3 mx-auto flex h-6 w-fit items-center rounded-full from-blue-400 to-blue-600 px-3 py-1 text-xs font-medium text-white ring-1 ring-inset ring-white/20 ring-offset-1 ring-offset-gray-950/5">
                Recomendado
              </span>

              <div className="flex flex-col">
                <CardHeader>
                  <CardTitle className="font-medium">Plano Pro</CardTitle>
                  <span className="my-3 block text-2xl font-semibold">
                    R$ 14,90 / mês
                  </span>
                </CardHeader>

                <CardContent className="space-y-4">
                  <hr className="border-dashed" />
                  <ul className="list-outside space-y-3 text-sm">
                    {[
                      'Orçamentos Ilimitados',
                      'Geração via IA no WhatsApp',
                      "PDF sem marca d'água",
                      'Painel de gestão completo',
                      'Suporte prioritário',
                    ].map(item => (
                      <li key={item} className="flex items-center gap-2">
                        <Check className="size-3 text-blue-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter className="flex flex-col gap-2">
                  <Button
                    className={`w-full mt-5 cursor-pointer bg-blue-600 hover:bg-blue-700 transition-all ${
                      userData?.plan === 'PRO'
                        ? 'opacity-40 cursor-not-allowed grayscale'
                        : ''
                    }`}
                    onClick={handleOpenProModal}
                    disabled={userData?.plan === 'PRO'}
                  >
                    {userData?.plan === 'PRO'
                      ? 'Plano Ativo'
                      : 'Ativar Plano Pro'}
                  </Button>
                  <p className="text-center text-[10px] text-zinc-400">
                    Sua assinatura não renova sozinha.
                  </p>
                </CardFooter>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <FormCompleteCustomer
        isOpen={completeModal}
        onClose={handleCloseCompleteModal}
        customerName={session?.user.user_metadata?.name || session?.user.email}
        isRegisterComplete={isRegisterComplete?.isRegisterComplete}
        selectedPlan="pro"
      />

      <LoadingValidationModal isOpen={loadingValidation} />

      <AlertErrorModal
        isOpen={errorModal}
        onClose={() => setErrorModal(false)}
      />
    </section>
  )
}
