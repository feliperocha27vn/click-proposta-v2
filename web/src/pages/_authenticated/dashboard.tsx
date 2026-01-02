import imagePersonFillingOutForm from '@/assets/person-filling-out-form.png'
import imagePersonWriteForm from '@/assets/person-write-form.png'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/contexts/auth-context'
import { type FetchCustomers200CustomersItem, fetchCustomers } from '@/http/api'
import { createFileRoute } from '@tanstack/react-router'
import { FileSearchCorner, NotebookPen, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import { CardDashboard } from './-components/card-dashboard'
import { MenuMobileAuth } from './-components/menu-mobile'

export const Route = createFileRoute('/_authenticated/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  const { session } = useAuth()
  const user = session?.user ?? null
  const [customers, setCustomers] = useState<FetchCustomers200CustomersItem[]>(
    []
  )
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCustomers().then(reply => {
      setCustomers(reply.customers)
      setLoading(false)
    })
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-3 xl:hidden">
          <Avatar>
            <AvatarImage src={user?.user_metadata?.avatar_url} />
            <AvatarFallback>
              <Skeleton className="size-8 not-first:rounded-full" />
            </AvatarFallback>
          </Avatar>
          {user ? (
            <p className="xl:text-2xl">
              Bem vindo(a), {user?.user_metadata?.full_name || user?.email}
            </p>
          ) : (
            <Skeleton className="h-6 w-48" />
          )}
        </div>
        <MenuMobileAuth />
      </div>

      <div className="grid grid-cols-2 gap-x-2">
        <CardDashboard
          icon={<NotebookPen size={32} />}
          title="Criar nova proposta"
          titleButton="Criar"
          link="/select-type-proposal"
          image={imagePersonFillingOutForm}
        />
        <CardDashboard
          icon={<FileSearchCorner size={32} />}
          title="Visualizar propostas"
          titleButton="Visualizar"
          link="/proposals"
          image={imagePersonWriteForm}
        />
      </div>

      <h1 className="font-semibold text-2xl mb-3">Meus Clientes</h1>
      <div className="relative">
        <div className="space-y-2 md:grid md:grid-cols-2 md:gap-4">
          {loading ? (
            <>
              <div className="space-y-2">
                <Skeleton className="h-4 w-6/12 bg-zinc-400 md:h-20  md:w-full" />
                <Skeleton className="h-2 w-8/12 bg-zinc-400 md:h-20 md:hidden" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-6/12 bg-zinc-400 md:h-20  md:w-full" />
                <Skeleton className="h-2 w-8/12 bg-zinc-400 md:h-20 md:hidden" />
              </div>
              <div className="space-y-2 opacity-80">
                <Skeleton className="h-4 w-6/12 bg-zinc-400 md:h-20  md:w-full" />
                <Skeleton className="h-2 w-8/12 bg-zinc-400 md:h-20 md:hidden" />
              </div>
              <div className="space-y-2 opacity-60">
                <Skeleton className="h-4 w-6/12 bg-zinc-400 md:h-20  md:w-full" />
                <Skeleton className="h-2 w-8/12 bg-zinc-400 md:h-20 md:hidden" />
              </div>
            </>
          ) : (
            customers.map(customer => (
              <div
                key={customer.id}
                className="border-b py-2 md:bg-neutral-100 md:p-5 md:rounded-lg md:shadow md:flex md:items-center md:gap-x-2 md:h-20"
              >
                <User className="hidden md:block size-10" />
                <div className="md:space-y-2">
                  <p className="font-semibold">{customer.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {customer.email}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
        {loading && (
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-linear-to-t from-white via-white/80 to-transparent pointer-events-none" />
        )}
      </div>
    </div>
  )
}
