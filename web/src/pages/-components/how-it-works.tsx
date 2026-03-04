import { AnimatedGroup } from '@/components/ui/animated-group'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Mail, ScrollText, Settings } from 'lucide-react'

const STEPS = [
  {
    id: '1',
    icon: ScrollText,
    title: 'Preencha o Formulário',
    description:
      'Um formulário intuitivo coleta as informações do cliente, escopo, preços e prazos em segundos.',
  },
  {
    id: '2',
    icon: Settings,
    title: 'Gere a Proposta',
    description:
      'A IA transforma as informações em uma proposta online profissional, sem esforço da sua parte.',
  },
  {
    id: '3',
    icon: Mail,
    title: 'Envie e Impressione',
    description:
      'Compartilhe o link da proposta e acompanhe em tempo real. Feche mais negócios.',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="w-full bg-white py-20 md:py-28">
      <div className="mx-auto max-w-[1280px] px-4 md:px-[8%] xl:px-[10%]">
        <div className="mb-12 text-center md:mb-16">
          <span className="mb-4 inline-block rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-zinc-500">
            Como funciona
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 md:text-4xl">
            Três passos para a proposta perfeita
          </h2>
          <p className="mt-4 text-zinc-500 md:text-lg">
            Simples o suficiente para qualquer profissional.
          </p>
        </div>

        <AnimatedGroup
          variants={{
            container: {
              visible: {
                transition: { staggerChildren: 0.08 },
              },
            },
            item: {
              hidden: { opacity: 0, filter: 'blur(12px)', y: 40 },
              visible: {
                opacity: 1,
                filter: 'blur(0px)',
                y: 0,
                transition: { type: 'spring', bounce: 0.25, duration: 0.9 },
              },
            },
          }}
          className="grid gap-6 md:grid-cols-3"
        >
          {STEPS.map((step, i) => {
            const Icon = step.icon
            return (
              <Card
                key={step.id}
                className="group relative flex flex-col border-zinc-100 bg-zinc-50 p-2 text-center transition-shadow hover:shadow-md"
              >
                <CardHeader className="flex flex-col items-center gap-3 pb-4">
                  <div className="flex size-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-100">
                    <Icon className="size-7" />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
                    Passo {i + 1}
                  </span>
                  <CardTitle className="text-lg font-semibold text-zinc-900">
                    {step.title}
                  </CardTitle>
                  <CardDescription className="text-sm leading-relaxed text-zinc-500">
                    {step.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            )
          })}
        </AnimatedGroup>
      </div>
    </section>
  )
}
