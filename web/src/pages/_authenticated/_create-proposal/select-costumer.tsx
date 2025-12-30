import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import {
  type FetchCustomers200CustomersItem,
  fetchCustomers,
  searchByNameEmail,
} from '@/http/api'
import { createFileRoute, Link, useSearch } from '@tanstack/react-router'
import { ArrowLeft, Search, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import FormCreateNewCustomer from './-components/form-create-new-customer'

export const Route = createFileRoute(
  '/_authenticated/_create-proposal/select-costumer'
)({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>) => ({
    type: (search.type as string) || '',
  }),
})

function RouteComponent() {
  const [customers, setCustomers] = useState<FetchCustomers200CustomersItem[]>(
    []
  )
  const [loading, setLoading] = useState(true)
  const [createModal, setCreateModal] = useState(false)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchCustomers().then(reply => {
      setCustomers(reply.customers)
      setLoading(false)
    })
  }, [])

  function handleCreateClick() {
    setCreateModal(true)
  }

  function handleCloseCreateModal() {
    setCreateModal(false)
  }

  function handleCreateSuccess() {
    // Recarrega a lista de clientes
    setLoading(true)
    fetchCustomers().then(reply => {
      setCustomers(reply.customers)
      setLoading(false)
    })
  }

  async function handleSearch(search: string) {
    await searchByNameEmail({ search }).then(reply =>
      setCustomers(reply.customers)
    )
  }

  const { type } = useSearch({
    from: '/_authenticated/_create-proposal/select-costumer',
  })

  return (
    <div className="space-y-4">
      <div className="flex w-full">
        <Link to="/select-type-proposal">
          <ArrowLeft className="cursor-pointer" />
        </Link>
        <div className="w-full flex justify-center font-semibold text-2xl">
          <h1>Escolha o cliente</h1>
        </div>
      </div>
      <div>
        <div className="relative xl:w-4/12">
          <Input
            className="pe-9"
            placeholder="Buscar cliente pelo nome ou email"
            type="email"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch(search)}
          />
          <button
            className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
            type="submit"
          >
            <Search
              size={16}
              aria-hidden="true"
              onClick={() => handleSearch(search)}
            />
          </button>
        </div>
      </div>
      <ScrollArea className="relative h-[30rem] rounded-md border p-4 w-full">
        <div className="space-y-2 md:grid md:grid-cols-2 md:gap-4">
          {loading ? (
            <>
              <Skeleton className="h-20 w-full rounded-lg bg-zinc-400" />
              <Skeleton className="h-20 w-full rounded-lg bg-zinc-400" />
              <Skeleton className="h-20 w-full rounded-lg bg-zinc-400 opacity-80" />
              <Skeleton className="h-20 w-full rounded-lg bg-zinc-400 opacity-60" />
            </>
          ) : (
            customers.map(customer => (
              <Link
                to={
                  type === 'budget-civil'
                    ? '/budget-civil/$customer-id'
                    : '/click-ai/$customer-id'
                }
                key={customer.id}
                params={{ 'customer-id': customer.id }}
                className="border-b py-2 bg-neutral-100 md:p-5 rounded-lg shadow flex items-center gap-x-2 h-20"
              >
                <User className="size-10" />
                <div className="md:space-y-2">
                  <p className="font-semibold truncate w-2/5">
                    {customer.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {customer.email}
                  </p>
                </div>
              </Link>
            ))
          )}
        </div>
        {loading && (
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
        )}
      </ScrollArea>
      <Button
        className="w-full cursor-pointer xl:w-4/12"
        onClick={handleCreateClick}
      >
        Criar um novo cliente
      </Button>

      <FormCreateNewCustomer
        isOpen={createModal}
        onClose={handleCloseCreateModal}
        onSuccess={handleCreateSuccess}
      />
    </div>
  )
}
