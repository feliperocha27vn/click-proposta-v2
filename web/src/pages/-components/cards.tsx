import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Mail, ScrollText, Settings } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'

export function Cards() {
  const cardsIconText = [
    {
      id: '1',
      icon: (
        <ScrollText className="size-8 md:size-10 xl:size-12 text-blue-600" />
      ),
      title: 'Preencha o Formulário',
      description:
        'Um formulário online intuitivo coleta informações do seu cliente, escopo, preços e prazos.',
      className: 'lg:translate-y-0',
      delay: '100ms',
    },
    {
      id: '2',
      icon: <Settings className="size-8 md:size-10 xl:size-12 text-blue-600" />,
      title: 'Gere a Proposta',
      description:
        'As informações são transformadas automaticamente em uma proposta online profissional.',
      className: 'lg:-translate-y-12 xl:-translate-y-16',
      delay: '250ms',
    },
    {
      id: '3',
      icon: <Mail className="size-8 md:size-10 xl:size-12 text-blue-600" />,
      title: 'Envie e Impressione',
      description:
        'Sua proposta está pronta para ser enviada, ajudando você a fechar mais negócios.',
      className: 'lg:-translate-y-6 xl:-translate-y-8',
      delay: '400ms',
    },
  ]

  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      {
        threshold: 0.1, // Dispara  assim que 10% do container aparece
        rootMargin: '0px 0px -50px 0px',
      }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className="w-full relative z-10 space-y-7 md:grid md:grid-cols-3 md:gap-6 lg:gap-8 md:space-y-0 py-8 lg:pt-24 lg:pb-12"
    >
      {cardsIconText.map(card => (
        <div
          key={card.id}
          className={twMerge(
            `group flex flex-col w-full h-full opacity-0 translate-y-24 transition-all duration-1000 ease-out`,
            card.className,
            isVisible && 'opacity-100 translate-y-0!'
          )}
          style={{ transitionDelay: card.delay }}
        >
          <Card className="flex flex-col h-full border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] transition-shadow duration-500 rounded-3xl bg-white overflow-hidden text-left">
            <div className="relative flex h-36 md:h-44 xl:h-52 w-full flex-col justify-end overflow-hidden bg-zinc-50/80 p-6 md:p-8">
              <div className="absolute inset-0 bg-linear-to-t from-blue-50/50 to-transparent transition-opacity duration-500 group-hover:opacity-100 opacity-0"></div>

              <div className="z-10 bg-white/80 backdrop-blur-sm border border-border/50 shadow-sm p-4 w-fit rounded-2xl transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-2 group-hover:shadow-md">
                {card.icon}
              </div>
            </div>

            <CardHeader className="flex flex-col items-start px-6 pt-8 pb-8 h-full border-t border-border/40">
              <CardTitle className="text-xl xl:text-[22px] font-bold text-foreground tracking-tight">
                {card.title}
              </CardTitle>
              <CardDescription className="text-sm xl:text-[15px] leading-relaxed text-muted-foreground mt-4 font-normal">
                {card.description}
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      ))}
    </div>
  )
}
