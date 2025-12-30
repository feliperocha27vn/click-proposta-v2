import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useAuth } from '@/contexts/auth-context'
import {
  type GetCompleteRegister200,
  getCompleteRegister,
  getMe,
} from '@/http/api'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Check } from 'lucide-react'
import { useEffect, useState } from 'react'
import FormCompleteCustomer from './-components/form-complete-customer'
import { LoadingValidationModal } from './-components/loading-validation-modal'

export const Route = createFileRoute('/_authenticated/plans')({
  component: RouteComponent,
})

function RouteComponent() {
  const { session } = useAuth()
  const [completeModal, setCompleteModal] = useState(false)
  const [loadingValidation, setLoadingValidation] = useState(false)
  const [isRegisterComplete, setIsRegisterComplete] =
    useState<GetCompleteRegister200>()

  // console.log(session?.user.user_metadata);

  useEffect(() => {
    getCompleteRegister()
      .then(reply => {
        setIsRegisterComplete(reply)
      })
      .catch(error => {
        console.error('Erro no useEffect inicial:', error)
      })
  }, [])

  async function handleOpenProModal() {
    // Sempre mostra loading primeiro
    setLoadingValidation(true)

    try {
      // Sempre faz uma nova chamada para garantir dados atualizados
      const reply = await getCompleteRegister()
      setIsRegisterComplete(reply)
      setLoadingValidation(false)

      // Abre o modal com os dados atualizados
      setCompleteModal(true)
    } catch (error) {
      setLoadingValidation(false)
      console.error('Erro ao verificar registro:', error)
    }
  }

  function handleCloseCompleteModal() {
    setCompleteModal(false)
  }

  const { data: userData } = useQuery({
    queryKey: ['user'],
    queryFn: getMe,
  })

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
                  {['2 propostas', 'Painel de gestão', 'Suporte por Email'].map(
                    item => (
                      <li key={item} className="flex items-center gap-2">
                        <Check className="size-3" />
                        {item}
                      </li>
                    )
                  )}
                </ul>
              </CardContent>

              <CardFooter className="mt-auto">
                <Button variant="outline" className="w-full cursor-pointer">
                  Começar
                </Button>
              </CardFooter>
            </Card>

            <Card className="relative">
              <span className="bg-linear-to-br/increasing absolute inset-x-0 -top-3 mx-auto flex h-6 w-fit items-center rounded-full from-purple-400 to-amber-300 px-3 py-1 text-xs font-medium text-amber-950 ring-1 ring-inset ring-white/20 ring-offset-1 ring-offset-gray-950/5">
                Popular
              </span>

              <div className="flex flex-col">
                <CardHeader>
                  <CardTitle className="font-medium">Pro</CardTitle>
                  <span className="my-3 block text-2xl font-semibold">
                    R$ 9,99 / mês
                  </span>
                </CardHeader>

                <CardContent className="space-y-4">
                  <hr className="border-dashed" />
                  <ul className="list-outside space-y-3 text-sm">
                    {[
                      '20 propostas',
                      'Painel de gestão',
                      'Suporte por Email',
                      "Propostas sem marca d'água",
                      'Atualizações Mensais de Produtos',
                    ].map(item => (
                      <li key={item} className="flex items-center gap-2">
                        <Check className="size-3" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter>
                  <Button
                    className="w-full mt-5 cursor-pointer"
                    onClick={handleOpenProModal}
                    disabled={userData?.user.plan === 'PRO'}
                  >
                    {userData?.user.plan === 'PRO'
                      ? 'Você já é um assinante'
                      : 'Assinar'}
                  </Button>
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
    </section>
  )
}
