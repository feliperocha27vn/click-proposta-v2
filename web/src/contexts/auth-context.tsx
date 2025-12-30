import { supabase } from '@/lib/supabase'
import type { Session, User } from '@supabase/supabase-js'
import { createContext, useContext, useEffect, useRef, useState } from 'react'

interface AuthContextType {
  session: Session | null
  user: User | null
  loading: boolean
  authLoading: boolean
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  forceSignOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<{
    session: Session | null
    user: User | null
    loading: boolean
    authLoading: boolean
  }>({
    session: null,
    user: null,
    loading: true,
    authLoading: false,
  })

  // Função helper para atualizar estado de forma atômica
  const updateAuthState = (updates: Partial<typeof state>) => {
    setState(current => ({ ...current, ...updates }))
  }

  // Guarda o id da sessão anterior para evitar updates redundantes
  const prevSessionIdRef = useRef<string | null>(null)

  // Inicialização - executa apenas uma vez (dependências intencionais)
  // biome-ignore lint/correctness/useExhaustiveDependencies: false positive
  useEffect(() => {
    let mounted = true

    const initAuth = async () => {
      try {
        console.log('🔍 Iniciando getSession...')
        const { data: { session }, error } = await supabase.auth.getSession()
        console.log('🔍 getSession result:', { session: !!session, user: session?.user?.email, error })

        if (!mounted) return

        if (error) {
          console.error('Erro ao buscar sessão:', error)
          updateAuthState({
            session: null,
            user: null,
            loading: false,
          })
          prevSessionIdRef.current = null
          return
        }

        // Só limpa tokens da URL DEPOIS de processar a sessão
        if (session && (window.location.hash.includes('access_token') || window.location.hash.includes('refresh_token'))) {
          console.log('🔍 Limpando tokens da URL após sessão criada')
          window.history.replaceState({}, document.title, window.location.pathname)
        }

        const sessionId = session?.user?.id ?? null
        console.debug('[auth] initAuth sessionId:', sessionId, 'prev:', prevSessionIdRef.current)

        // Só atualiza o estado se a sessão mudou (evita loops de atualização)
        if (prevSessionIdRef.current !== sessionId) {
          updateAuthState({
            session,
            user: session?.user || null,
            loading: false,
          })
          prevSessionIdRef.current = sessionId
          console.debug('[auth] updated state from initAuth/onAuthStateChange ->', sessionId)
        } else {
          // garante que o loading seja desligado sem forçar merge de usuário igual
          updateAuthState({ loading: false })
        }

      } catch (error) {
        console.error('Erro inesperado na inicialização:', error)
        if (mounted) {
          updateAuthState({
            session: null,
            user: null,
            loading: false,
          })
        }
      }
    }

    // Listener para mudanças de autenticação
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return

      console.log('Auth event:', event, session?.user?.email)
      console.debug('[auth] onAuthStateChange session id:', session?.user?.id, 'prev:', prevSessionIdRef.current)

      // Ignora INITIAL_SESSION pois já tratamos no initAuth
      if (event === 'INITIAL_SESSION') return

      const sessionId = session?.user?.id ?? null

      if (prevSessionIdRef.current !== sessionId) {
        updateAuthState({
          session,
          user: session?.user || null,
          loading: false,
        })
        prevSessionIdRef.current = sessionId
      } else {
        updateAuthState({ loading: false })
      }
    })
    const subscription = data?.subscription

    initAuth()

    return () => {
      mounted = false
      subscription?.unsubscribe()
    }
  }, []) // Array vazio - executa apenas uma vez

  // Função de login do Google
  const signInWithGoogle = async () => {
    if (state.authLoading) return

    try {
      updateAuthState({ authLoading: true })

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'select_account',
          },
        },
      })

      if (error) {
        console.error('Erro no signInWithOAuth:', error)
        throw error
      }

    } catch (error) {
      console.error('Erro no login:', error)
      updateAuthState({ authLoading: false })
      throw error
    }
    // Não definir authLoading=false aqui pois o usuário será redirecionado
  }  // Função de logout forçado (limpa tudo)
  const forceSignOut = async () => {
    try {
      updateAuthState({ authLoading: true })

      // Limpar storage local
      localStorage.clear()
      sessionStorage.clear()

      // Limpar cookies do supabase
      document.cookie.split(";").forEach(function (c) {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });

      // Sign out do supabase
      await supabase.auth.signOut()

      // Limpar URL de tokens
      if (window.location.hash.includes('access_token') || window.location.hash.includes('refresh_token')) {
        window.history.replaceState({}, document.title, window.location.pathname)
      }

      // Forçar estado limpo
      updateAuthState({
        session: null,
        user: null,
        loading: false,
        authLoading: false,
      })
      prevSessionIdRef.current = null

      console.log('Logout forçado concluído')

    } catch (error) {
      console.error('Erro no logout forçado:', error)
    } finally {
      updateAuthState({ authLoading: false })
    }
  }

  // Função de logout
  const signOut = async () => {
    if (state.authLoading) return

    try {
      updateAuthState({ authLoading: true })

      const { error } = await supabase.auth.signOut()
      if (error) throw error

    } catch (error) {
      console.error('Erro no logout:', error)
      throw error
    } finally {
      updateAuthState({ authLoading: false })
    }
  }

  const contextValue: AuthContextType = {
    session: state.session,
    user: state.user,
    loading: state.loading,
    authLoading: state.authLoading,
    signInWithGoogle,
    signOut,
    forceSignOut,
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth deve ser usado dentro do AuthProvider')
  }

  return context
}