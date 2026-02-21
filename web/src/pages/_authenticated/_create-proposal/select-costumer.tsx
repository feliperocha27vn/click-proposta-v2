import { BackButton } from '@/components/back-button'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import {
  type FetchCustomers200CustomersItem,
  fetchCustomers,
  searchByNameEmail,
} from '@/http/api'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, Link, useSearch } from '@tanstack/react-router'
import { ChevronRight, Plus, Search, User } from 'lucide-react'
import { useState } from 'react'
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
  const queryClient = useQueryClient()
  const [createModal, setCreateModal] = useState(false)
  const [search, setSearch] = useState('')
  const [appliedSearch, setAppliedSearch] = useState('')

  const { data: customers = [], isLoading: loading } = useQuery({
    queryKey: ['customers', appliedSearch],
    queryFn: async () => {
      if (appliedSearch) {
        const reply = await searchByNameEmail({ search: appliedSearch })
        return reply.customers as unknown as FetchCustomers200CustomersItem[]
      }
      const reply = await fetchCustomers()
      return reply.customers
    },
  })

  function handleCreateClick() {
    setCreateModal(true)
  }

  function handleCloseCreateModal() {
    setCreateModal(false)
  }

  function handleCreateSuccess() {
    queryClient.invalidateQueries({ queryKey: ['customers'] })
  }

  function handleSearch() {
    setAppliedSearch(search)
  }

  const { type } = useSearch({
    from: '/_authenticated/_create-proposal/select-costumer',
  })

  return (
    <div className="min-h-screen font-inter">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="xl:hidden">
              <BackButton to="/select-type-proposal" />
            </div>
            <h1 className="hidden md:block text-3xl font-bold tracking-tight text-slate-900">
              Escolha o cliente
            </h1>
          </div>
          <div className="flex justify-center md:hidden">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Escolha o cliente
            </h1>
          </div>
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              className="pl-10 h-10 bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg text-sm"
              placeholder="Buscar cliente pelo nome ou email"
              type="text"
              value={search}
              onChange={e => {
                setSearch(e.target.value)
              }}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  handleSearch()
                }
              }}
            />
          </div>
        </div>

        {/* Action Section */}
        <div>
          <Button
            onClick={handleCreateClick}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg flex items-center gap-2 shadow-sm shadow-blue-200 transition-all hover:scale-105"
          >
            <Plus className="h-4 w-4" />
            Novo Cliente
          </Button>
        </div>

        {/* List Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <ScrollArea className="h-150 w-full">
            {loading ? (
              <div className="p-6 space-y-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-3 w-1/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : customers.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {customers.map(customer => (
                  <Link
                    key={customer.id}
                    to={
                      type === 'budget-civil'
                        ? '/budget-civil/$customer-id'
                        : '/budget-products/$customer-id'
                    }
                    params={{ 'customer-id': customer.id }}
                    className="group flex flex-col md:flex-row md:items-center justify-between p-4 md:p-6 hover:bg-blue-50/50 transition-colors duration-200 gap-4 cursor-pointer"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                        <User className="h-6 w-6" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full items-center">
                        <div>
                          <p className="font-semibold text-slate-900">
                            {customer.name}
                          </p>
                        </div>
                        <div className="hidden md:block">
                          <p className="text-sm text-slate-500">
                            {customer.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="hidden md:flex items-center text-slate-300 group-hover:text-blue-500 transition-colors">
                      <ChevronRight className="h-5 w-5" />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-slate-500">
                <User className="h-12 w-12 mb-4 text-slate-300" />
                <p className="text-lg font-medium">Nenhum cliente encontrado</p>
                <p className="text-sm">
                  Tente buscar por outro termo ou cadastre um novo.
                </p>
              </div>
            )}
          </ScrollArea>
        </div>
      </div>

      <FormCreateNewCustomer
        isOpen={createModal}
        onClose={handleCloseCreateModal}
        onSuccess={handleCreateSuccess}
      />
    </div>
  )
}
