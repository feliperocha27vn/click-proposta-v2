import { useAuth } from '@/contexts/auth-context'
import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

type CallbackSearch = {
  error?: string
  error_description?: string
}

export const Route = createFileRoute('/auth/callback')({
  validateSearch: (search): CallbackSearch => search as CallbackSearch,
  component: CallbackComponent,
})

function CallbackComponent() {
  const navigate = useNavigate()
  const { session, loading } = useAuth()
  const search = useSearch({ from: '/auth/callback' })
  const [hasProcessed, setHasProcessed] = useState(false)

  useEffect(() => {
    console.log('🔍 Callback Debug:', {
      url: window.location.href,
      hash: window.location.hash,
      search: search,
      session: !!session,
      loading: loading,
      hasProcessed: hasProcessed
    })

    // Se há erro na URL, mostra e redireciona
    if (search.error) {
      console.error('OAuth error:', search.error)
      setTimeout(() => {
        navigate({
          to: '/login',
          search: { error: 'Erro na autenticação. Tente novamente.' },
          replace: true
        })
      }, 2000)
      return
    }

    // Só processa quando loading terminar e ainda não processou
    if (!loading && !hasProcessed) {
      setHasProcessed(true)

      if (session) {
        console.log('Login bem-sucedido, redirecionando...')
        navigate({ to: '/dashboard', replace: true })
      } else {
        console.log('Nenhuma sessão encontrada, voltando ao login')
        navigate({
          to: '/login',
          search: { error: 'Falha na autenticação.' },
          replace: true
        })
      }
    }
  }, [loading, session, search.error, hasProcessed, navigate])

  // Se há erro, mostra mensagem
  if (search.error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md p-6">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <title>Erro na Autenticação</title>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Erro na Autenticação
          </h2>
          <p className="text-gray-600 mb-4">
            {search.error_description || search.error}
          </p>
          <p className="text-sm text-gray-500">
            Redirecionando para login...
          </p>
        </div>
      </div>
    )
  }

  // Loading padrão
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Finalizando autenticação...</p>
      </div>
    </div>
  )
}