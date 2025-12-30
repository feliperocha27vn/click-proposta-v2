import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/contexts/auth-context'
import { getMe } from '@/http/api'
import { useQuery } from '@tanstack/react-query'
import {
  createFileRoute,
  Link,
  Navigate,
  Outlet,
  useLocation,
} from '@tanstack/react-router'
import {
  Briefcase,
  FileArchive,
  Home,
  LogOut,
  LucideDollarSign,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'

export const Route = createFileRoute('/_authenticated')({
  component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
  const { session, loading, signOut } = useAuth()
  const [timeoutReached, setTimeoutReached] = useState(false)
  const location = useLocation()

  // Timeout para mostrar mensagem após 5 segundos
  useEffect(() => {
    if (!loading) return

    const timer = setTimeout(() => {
      setTimeoutReached(true)
    }, 5000)

    return () => clearTimeout(timer)
  }, [loading])

  // Reset timeout quando loading para
  useEffect(() => {
    if (!loading) {
      setTimeoutReached(false)
    }
  }, [loading])

  const { data: userData } = useQuery({
    queryKey: ['user'],
    queryFn: getMe,
  })

  // Mostra loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md p-6">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-lg font-medium text-gray-900 mb-2">
            Verificando autenticação
          </h2>
          <p className="text-gray-600">Aguarde um momento...</p>

          {timeoutReached && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800 mb-2">
                Está demorando mais que o esperado
              </p>
              <button
                onClick={() => window.location.reload()}
                className="text-sm text-yellow-800 underline hover:text-yellow-900"
                type="button"
              >
                Recarregar página
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Se não tem sessão, redireciona para login
  if (!session) {
    const currentPath = window.location.pathname
    const redirectPath = currentPath === '/' ? '/dashboard' : currentPath

    return <Navigate to="/login" search={{ redirect: redirectPath }} replace />
  }

  // Usuário autenticado - renderiza conteúdo
  return (
    <div className="xl:flex xl:h-screen">
      <PanelGroup direction="horizontal" className="h-screen">
        <Panel
          defaultSize={20}
          minSize={15}
          maxSize={40}
          className="hidden xl:block"
        >
          <div className="px-4 py-5 h-screen flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-full flex justify-center mb-6 text-xl">
                <span className="text-primary font-semibold">Click</span>
                <span className="font-normal">.proposta</span>
              </div>
              <Link to="/dashboard">
                <div
                  className={`flex items-center gap-x-2 text-lg text-zinc-700 py-2 px-4 rounded-xl duration-300 cursor-pointer ${location.pathname === '/dashboard' ? 'bg-zinc-200 text-black' : ''}`}
                >
                  <Home />
                  <span className="relative group">
                    Painel
                    <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-current transform -translate-x-1/2 group-hover:w-full transition-all duration-300 ease-out"></div>
                  </span>
                </div>
              </Link>
              <Link to="/proposals">
                <div
                  className={`flex items-center gap-x-2 text-lg text-zinc-700 py-2 px-4 rounded-xl duration-300 cursor-pointer ${location.pathname === '/proposals' ? 'bg-zinc-200 text-black' : ''}`}
                >
                  <FileArchive />
                  <span className="relative group">
                    Propostas
                    <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-current transform -translate-x-1/2 group-hover:w-full transition-all duration-300 ease-out"></div>
                  </span>
                </div>
              </Link>
              <Link to="/my-services">
                <div
                  className={`flex items-center gap-x-2 text-lg text-zinc-700 py-2 px-4 rounded-xl duration-300 cursor-pointer ${location.pathname === '/my-services' ? 'bg-zinc-200 text-black' : ''}`}
                >
                  <Briefcase />
                  <span className="relative group">
                    Meus Serviços
                    <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-current transform -translate-x-1/2 group-hover:w-full transition-all duration-300 ease-out"></div>
                  </span>
                </div>
              </Link>
              <Link to="/plans">
                <div
                  className={`flex items-center gap-x-2 text-lg text-zinc-700 py-2 px-4 rounded-xl duration-300 cursor-pointer ${location.pathname === '/plans' ? 'bg-zinc-200 text-black' : ''}`}
                >
                  <LucideDollarSign />
                  <span className="relative group">
                    Planos
                    <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-current transform -translate-x-1/2 group-hover:w-full transition-all duration-300 ease-out"></div>
                  </span>
                </div>
              </Link>
            </div>
            <div className="flex items-center gap-x-4 font-semibold">
              <Avatar className="size-12">
                <AvatarImage src={userData?.user.avatarUrl ?? ''} />
                <AvatarFallback>
                  <Skeleton className="size-8 not-first:rounded-full" />
                </AvatarFallback>
              </Avatar>
              <p>{userData?.user.name}</p>
              <Button
                variant="outline"
                onClick={() => signOut()}
                className="ml-auto cursor-pointer"
              >
                <LogOut />
              </Button>
            </div>
          </div>
        </Panel>

        <PanelResizeHandle className="w-px bg-zinc-200 hover:bg-zinc-600 transition-colors duration-150" />

        <Panel defaultSize={80} minSize={60}>
          <div className="px-4 py-4 h-screen overflow-y-auto">
            <Outlet />
          </div>
        </Panel>
      </PanelGroup>
    </div>
  )
}
