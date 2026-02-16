import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { type GetPublicBudget200, getPublicBudget } from '@/http/api'
import { createFileRoute, Link, useParams } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/public-budget/$budget-id')({
  component: RouteComponent,
})

function RouteComponent() {
  const { 'budget-id': budgetId } = useParams({ strict: false })
  const [budgetData, setBudgetData] = useState<GetPublicBudget200['budget']>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (budgetId) {
      getPublicBudget(budgetId)
        .then(response => {
          setBudgetData(response.budget)
          setLoading(false)
        })
        .catch(err => {
          console.error(err)
          setError(true)
          setLoading(false)
        })
    }
  }, [budgetId])

  const formatterPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <h1 className="text-2xl font-bold text-red-500 mb-2">
          Erro ao carregar orçamento
        </h1>
        <p className="text-zinc-500 text-center">
          Não foi possível encontrar este orçamento. Verifique o link e tente
          novamente.
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-xl border-zinc-100/50 bg-white/80 backdrop-blur-sm">
        <CardHeader className="bg-zinc-900 text-white rounded-t-xl p-8 space-y-4">
          <div className="space-y-2">
            {loading ? (
              <Skeleton className="h-4 w-32 bg-zinc-700/50" />
            ) : (
              <p className="text-sm font-medium text-zinc-400 uppercase tracking-wider">
                Proposta Comercial
              </p>
            )}
            {loading ? (
              <Skeleton className="h-8 w-3/4 bg-zinc-700" />
            ) : (
              <>
                <h1 className="text-3xl font-bold tracking-tight text-white">
                  {budgetData?.title}
                </h1>
                {budgetData?.budgetsServices.some(
                  s => s.price && s.price > 0
                ) && (
                  <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-blue-600 text-white hover:bg-blue-700 w-fit">
                    Orçamento de Produtos
                  </span>
                )}
              </>
            )}
          </div>
          <div className="flex items-center space-x-2 text-zinc-300">
            <span className="text-sm">Para:</span>
            {loading ? (
              <Skeleton className="h-5 w-40 bg-zinc-700" />
            ) : (
              <span className="font-semibold text-white">
                {budgetData?.customer.name}
              </span>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-8 space-y-8">
          {/* Provider Info */}
          <div className="flex items-center space-x-4">
            {loading ? (
              <Skeleton className="h-14 w-14 rounded-full" />
            ) : (
              <Avatar className="h-14 w-14 border-2 border-zinc-100">
                <AvatarImage src={budgetData?.user.avatarUrl || undefined} />
                <AvatarFallback className="bg-zinc-100 font-bold text-zinc-700">
                  {budgetData?.user.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
            )}
            <div className="space-y-1">
              <p className="text-xs text-zinc-500 uppercase tracking-wide font-medium">
                Profissional
              </p>
              {loading ? (
                <Skeleton className="h-6 w-48" />
              ) : (
                <h3 className="font-bold text-lg text-zinc-900">
                  {budgetData?.user.name}
                </h3>
              )}
            </div>
          </div>

          <Separator className="bg-zinc-100" />

          {/* Services */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-xl text-zinc-900">
                Itens do Orçamento
              </h3>
            </div>

            <div className="space-y-6">
              {loading
                ? [1, 2, 3].map(i => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between">
                        <Skeleton className="h-5 w-1/2" />
                        <Skeleton className="h-5 w-20" />
                      </div>
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  ))
                : budgetData?.budgetsServices.map(service => (
                    <div key={service.id} className="group">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-medium text-zinc-900">
                          {service.title}
                        </h4>
                        {(service.price ?? 0) > 0 && (
                          <div className="text-right text-sm">
                            {service.quantity && (
                              <span className="block text-zinc-500">
                                Qtd: {service.quantity}
                              </span>
                            )}
                            {service.price && (
                              <span className="block font-medium text-zinc-900">
                                {formatterPrice.format(Number(service.price))}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-zinc-500 leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                  ))}
            </div>
          </div>

          <Separator className="bg-zinc-100" />

          {/* Total */}
          <div className="flex items-center justify-between bg-zinc-50 p-6 rounded-xl border border-zinc-100">
            <div className="space-y-1">
              <p className="text-sm text-zinc-500 font-medium">
                Investimento Total
              </p>
              <p className="text-xs text-zinc-400">Validade: 15 dias</p>
            </div>
            {loading ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              <span className="text-3xl font-bold text-zinc-900">
                {formatterPrice.format(budgetData?.total || 0)}
              </span>
            )}
          </div>
        </CardContent>

        <CardFooter className="bg-zinc-50/50 p-6 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-b-xl">
          <p className="text-xs text-zinc-400 text-center sm:text-left">
            Gerado via{' '}
            <strong className="font-semibold text-zinc-600">
              Click Proposta
            </strong>
          </p>
          <Button
            asChild
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm hover:shadow-md transition-all"
          >
            <Link to="/">Criar meu orçamento grátis</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
