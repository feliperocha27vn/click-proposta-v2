import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth-context'
import { createFileRoute, Navigate } from '@tanstack/react-router'
import Logo from '../assets/logo.png'

export const Route = createFileRoute('/login')({
  component: RouteComponent,
})

function RouteComponent() {
  const { session, signInWithGoogle, loading, authLoading, forceSignOut } = useAuth()

  const handleGoogleLogin = async () => {
    try {
      // Primeiro limpa tudo
      await forceSignOut()
      // Aguarda um pouco
      await new Promise(resolve => setTimeout(resolve, 1000))
      // Então faz login
      await signInWithGoogle()
    } catch (error) {
      console.error('Erro no login:', error)
    }
  }

  // Redirect to dashboard if already logged in
  if (!loading && session) {
    return <Navigate to="/dashboard" />
  }

  // Show loading while checking session
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Verificando sessão...</p>
        </div>
      </div>
    )
  }

  return (
    <section className="flex min-h-screen bg-zinc-50 md:py-32 dark:bg-transparent">
      <form action="" className="max-w-92 m-auto h-fit w-full">
        <div className="p-6">
          <div className='flex flex-col items-center'>
            <img src={Logo} alt="Logo da Click Proposta" className="h-16" />
            <h1 className="mb-1 mt-4 text-xl font-semibold self-start">
              Entre na Click Proposta
            </h1>
            <p className="font-light">
              Não perca tempo, comece a agora a criar propostas profissionais
            </p>
          </div>

          <div className="mt-6 space-y-3">
            <Button
              type="button"
              variant="outline"
              className="w-full cursor-pointer"
              onClick={handleGoogleLogin}
              disabled={authLoading}
            >
              {authLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                  <span>Redirecionando...</span>
                </div>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="0.98em"
                    height="1em"
                    viewBox="0 0 256 262"
                    role="img"
                    aria-labelledby="google-icon-title"
                  >
                    <title>Google Icon</title>
                    <path
                      fill="#4285f4"
                      d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                    ></path>
                    <path
                      fill="#34a853"
                      d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                    ></path>
                    <path
                      fill="#fbbc05"
                      d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"
                    ></path>
                    <path
                      fill="#fbbc05"
                      d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"
                    ></path>
                    <path
                      fill="#eb4335"
                      d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                    ></path>
                  </svg>
                  <span>Entre com o Google</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </section>
  )
}
