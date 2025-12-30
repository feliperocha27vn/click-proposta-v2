import { AuthProvider } from '@/contexts/auth-context'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/react-query'
// Import the generated route tree
import { routeTree } from './routeTree.gen'

// Create a new router instance
const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  defaultNotFoundComponent: () => {
    // Limpeza simples da URL
    if (
      window.location.hash &&
      !window.location.pathname.includes('/auth/callback')
    ) {
      const cleanPath = window.location.pathname + window.location.search
      window.history.replaceState({}, '', cleanPath)
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Página não encontrada
          </h1>
          <p className="text-gray-600 mb-6">
            A página que você está procurando não existe.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => window.history.back()}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              type="button"
            >
              Voltar
            </button>
            <a
              href="/"
              className="block w-full bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 text-center"
            >
              Página inicial
            </a>
          </div>
        </div>
      </div>
    )
  },
  defaultErrorComponent: ({ error, reset }) => {
    // Log simples do erro
    console.error('Router Error:', error)

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Algo deu errado
          </h1>
          <p className="text-gray-600 mb-6">Encontramos um erro inesperado.</p>
          <div className="space-y-3">
            <button
              onClick={reset}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              type="button"
            >
              Tentar novamente
            </button>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
              type="button"
            >
              Recarregar página
            </button>
          </div>
        </div>
      </div>
    )
  },
  defaultPendingComponent: () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Carregando...</p>
      </div>
    </div>
  ),
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// Simple Error Boundary
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('App Error Boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center max-w-md mx-auto p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Erro na aplicação
            </h1>
            <p className="text-gray-600 mb-6">
              Algo deu errado. Tente recarregar a página.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              type="button"
            >
              Recarregar aplicação
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element not found')
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  </React.StrictMode>
)
