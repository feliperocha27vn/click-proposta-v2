import { Bot, ChevronRight } from 'lucide-react'
import type { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Link } from '@tanstack/react-router'

export interface HeroSectionProps extends ComponentProps<'section'> {}

export function HeroSection({ className, ...props }: HeroSectionProps) {
  return (
    <section
      data-slot="hero-section"
      className={twMerge(
        'relative w-full overflow-hidden bg-white',
        className
      )}
      {...props}
    >
      {/* Aura de Fundo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 60% -10%, oklch(0.88 0.1 240 / 0.4), transparent 70%), radial-gradient(ellipse 50% 40% at 10% 80%, oklch(0.85 0.08 180 / 0.25), transparent 60%)',
        }}
      />

      <div className="relative z-10 mx-auto flex w-full max-w-md flex-col md:max-w-5xl md:flex-row md:items-center md:justify-between lg:max-w-7xl">
        <div className="flex flex-col gap-5 p-6 pb-2 md:w-[55%] md:p-8 lg:p-16 relative z-10">
          {/* Top Badge */}
          <div className="flex animate-fade-in-up [animation-delay:100ms]">
            <Link to="/login">
              <Badge className="bg-[#1447E6] hover:bg-[#1447E6]/90 gap-1.5 cursor-pointer text-white px-3 py-1 md:px-4 md:py-1.5 text-xs md:text-sm shadow-md shadow-blue-500/20">
                Comece com 2 propostas grátis
                <ChevronRight className="size-3.5 md:size-4" />
              </Badge>
            </Link>
          </div>

          {/* Headings */}
          <h1 className="text-[38px] md:text-5xl lg:text-6xl xl:text-[68px] leading-[1.12] tracking-tight text-foreground font-extrabold text-balance animate-fade-in-up [animation-delay:200ms]">
            Crie propostas profissionais em minutos, não horas.
          </h1>

          <p className="text-base md:text-lg xl:text-xl leading-relaxed text-foreground-subtle max-w-xl animate-fade-in-up [animation-delay:300ms]">
            Deixe a IA escrever. Foque em fechar negócios. Impressione clientes
            com documentos que convertem de verdade.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 mt-2 md:mt-6 animate-fade-in-up [animation-delay:400ms]">
            <Link to="/login" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full text-base bg-blue-600 hover:bg-blue-700 text-white border-blue-600 md:h-14 md:px-8 md:rounded-xl shadow-lg shadow-blue-500/25 transition-transform hover:scale-105"
              >
                Começar de graça
              </Button>
            </Link>
            <a href="#how-it-works" className="w-full sm:w-auto">
              <Button variant="ghost" size="lg" className="w-full text-base md:h-14 md:px-8 md:rounded-xl transition-colors hover:bg-zinc-100">
                Como funciona?
              </Button>
            </a>
          </div>
        </div>

        {/* Bottom Visual Details */}
        <div className="relative mt-8 mb-10 md:mt-0 md:mb-0 flex flex-col mx-6 md:mx-0 md:w-[45%] md:p-8 md:pl-0 lg:p-12 z-10">
          {/* Floating Availability Tag - uses the same card-reveal entrance logic on the wrapper */}
          <div className="self-end mb-6 md:absolute md:-left-4 lg:-left-8 md:top-4 lg:top-8 md:mb-0 z-40 animate-fade-in-up [animation-delay:600ms]">
            <div className="bg-white shadow-xl border border-border/50 rounded-2xl py-3 px-4 flex items-center gap-3 hover:scale-105 transition-transform cursor-default">
              <Bot className="size-5 text-foreground" />
              <span className="text-[13px] text-foreground font-bold leading-none">
                Disponível 24H{' '}
              </span>
            </div>
          </div>

          {/* Cover Image */}
          <div className="w-full h-65 md:h-100 lg:h-150 relative rounded-[20px] md:rounded-3xl overflow-hidden bg-muted shrink-0 shadow-lg md:shadow-2xl animate-fade-in-up [animation-delay:500ms]">
            <img
              src="https://workers.paper.design/file-assets/01KKHMM6XWMD6NGE6QKNGP7SH0/01KKHRBTMX14FF5GCKQJXVPDPE.png"
              alt="Pessoa usando o aplicativo pelo celular na rua"
              className="w-full h-full object-cover object-center"
            />
          </div>

          {/* Floating Features Card - applying the reveal animation wrapper */}
          <div className="absolute top-4 left-0 w-[70%] max-w-65 md:top-auto md:bottom-8 lg:bottom-16 md:-left-8 lg:-left-16 md:w-72 lg:w-80 md:max-w-none z-20 animate-fade-in-up [animation-delay:700ms]">
            <Card className="w-full border-none shadow-[0_8px_24px_rgba(0,0,0,0.06)] md:shadow-[0_20px_40px_rgba(0,0,0,0.12)] bg-white rounded-2xl hover:scale-105 hover:shadow-[0_20px_40px_rgba(0,0,0,0.18)] transition-all duration-300">
              <CardContent className="p-4 md:p-5 lg:p-6">
                <h3 className="text-[13px] md:text-sm leading-snug text-foreground font-bold">
                  Escreva os itens da sua proposta como se estivesse conversando.
                  Nossa IA entende tudo!
                </h3>
                <p className="text-[10px] md:text-xs leading-relaxed text-muted-foreground mt-1 md:mt-2">
                  Orçamentos organizados e profissionais que passam confiança para o
                  seu cliente.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Floating Bottom CTA */}
          <div className="absolute -bottom-5 left-0 w-full flex justify-center md:hidden z-30 animate-fade-in-up [animation-delay:800ms]">
            <Link to="/login">
              <Button
                size="md"
                className="rounded-xl shadow-md font-semibold px-6 bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
              >
                Faça seu primeiro orçamento
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
