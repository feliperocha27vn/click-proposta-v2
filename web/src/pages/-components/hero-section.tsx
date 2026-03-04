import { Button } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'
import { ArrowRight, Bolt } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden bg-white">
      {/* Aura de fundo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 60% -10%, oklch(0.88 0.1 240 / 0.4), transparent 70%), radial-gradient(ellipse 50% 40% at 10% 80%, oklch(0.85 0.08 180 / 0.25), transparent 60%)',
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-[1280px] px-4 md:px-[8%] xl:px-[10%]">
        <div className="flex flex-col items-center pt-20 pb-24 text-center md:pb-32 md:pt-28">
          {/* Badge */}
          <a
            href="#pricing"
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100"
          >
            <Bolt className="size-3.5" />
            Comece com 2 propostas grátis, sem cartão
            <ArrowRight className="size-3.5" />
          </a>

          {/* Headline */}
          <h1 className="max-w-3xl text-balance text-4xl font-bold leading-[1.1] tracking-tight text-zinc-900 md:text-5xl xl:text-6xl">
            Crie propostas profissionais em{' '}
            <span className="relative">
              <span className="relative z-10 text-blue-600">minutos</span>
              <svg
                className="absolute -bottom-1 left-0 z-0 w-full"
                viewBox="0 0 200 8"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M1 5.5 C50 1 150 1 199 5.5"
                  stroke="oklch(0.65 0.22 250)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            , não horas.
          </h1>

          {/* Sub */}
          <p className="mt-6 max-w-xl text-balance text-base text-zinc-500 md:text-lg xl:text-xl">
            Deixe a IA escrever. Foque em fechar negócios. Impressione clientes
            com documentos que convertem de verdade.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex w-full flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link to="/login">
              <Button
                size="lg"
                className="h-12 w-full cursor-pointer rounded-xl px-8 text-base sm:w-auto"
              >
                Começar de graça
              </Button>
            </Link>
            <a href="#how-it-works">
              <Button
                variant="ghost"
                size="lg"
                className="h-12 w-full cursor-pointer rounded-xl px-8 text-base text-zinc-600 sm:w-auto"
              >
                Como funciona?
              </Button>
            </a>
          </div>

          {/* Social proof */}
          <p className="mt-8 text-xs text-zinc-400">
            Sem necessidade de cartão de crédito · Grátis para sempre
          </p>
        </div>
      </div>
    </section>
  )
}
