import { Button } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'
import { Check, Sparkles, Zap } from 'lucide-react'

const FREE_FEATURES = [
  '2 Propostas / Orçamentos',
  'Painel de gestão completo',
  'Suporte por email',
]

const PRO_FEATURES = [
  '20 Propostas / Orçamentos',
  'Painel de gestão completo',
  'Suporte prioritário',
  'Atualizações mensais de produto',
  'Propostas via WhatsApp com IA',
]

export function PricingSection() {
  return (
    <section id="pricing" className="w-full bg-zinc-50 py-20 md:py-28">
      <div className="mx-auto max-w-[1280px] px-4 md:px-[8%] xl:px-[10%]">
        {/* Header */}
        <div className="mx-auto mb-12 max-w-2xl text-center md:mb-16">
          <span className="mb-4 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-blue-600">
            Preços
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 md:text-4xl">
            Simples, transparente, sem surpresas
          </h2>
          <p className="mt-4 text-zinc-500 md:text-lg">
            Pague só quando precisar. Sem assinatura mensal, sem taxa escondida.
          </p>
        </div>

        {/* Grid de cards */}
        <div className="mx-auto grid max-w-3xl gap-6 md:grid-cols-2">
          {/* Plano Grátis */}
          <div className="flex flex-col rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
            <div className="mb-6">
              <p className="text-sm font-semibold uppercase tracking-widest text-zinc-400">
                Gratuito
              </p>
              <div className="mt-3 flex items-end gap-1">
                <span className="text-4xl font-bold text-zinc-900">R$ 0</span>
                <span className="mb-1 text-zinc-500">/ para sempre</span>
              </div>
              <p className="mt-2 text-sm text-zinc-500">
                Perfeito para experimentar a plataforma.
              </p>
            </div>

            <ul className="flex-1 space-y-3">
              {FREE_FEATURES.map(f => (
                <li
                  key={f}
                  className="flex items-start gap-3 text-sm text-zinc-600"
                >
                  <Check className="mt-0.5 size-4 shrink-0 text-zinc-400" />
                  {f}
                </li>
              ))}
            </ul>

            <Link to="/login" className="mt-8 block">
              <Button
                variant="outline"
                className="h-11 w-full cursor-pointer rounded-xl border-zinc-300 text-sm"
              >
                Criar conta gratuita
              </Button>
            </Link>
          </div>

          {/* Plano Créditos — Destaque */}
          <div className="relative flex flex-col rounded-2xl border border-blue-500 bg-white p-8 shadow-xl shadow-blue-100">
            {/* Badge Popular */}
            <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-4 py-1 text-xs font-semibold text-white shadow">
              ✦ Mais Popular
            </span>

            <div className="mb-6">
              <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-blue-600">
                <Zap className="size-4" />
                Pacote de Créditos
              </p>
              <div className="mt-3 flex items-end gap-1">
                <span className="text-4xl font-bold text-zinc-900">
                  R$ 9,90
                </span>
                <span className="mb-1 text-zinc-500">/ recarga</span>
              </div>
              <p className="mt-2 text-sm font-medium text-blue-600">
                = 20 propostas por apenas R$ 0,49 cada
              </p>
            </div>

            <ul className="flex-1 space-y-3">
              {PRO_FEATURES.map(f => (
                <li
                  key={f}
                  className="flex items-start gap-3 text-sm text-zinc-700"
                >
                  <Check className="mt-0.5 size-4 shrink-0 text-blue-500" />
                  {f}
                </li>
              ))}
            </ul>

            {/* Value anchoring */}
            <div className="mt-6 rounded-xl bg-blue-50 px-4 py-3">
              <p className="flex items-center gap-2 text-xs font-medium text-blue-700">
                <Sparkles className="size-3.5 shrink-0" />
                Você economiza horas de trabalho. 20 créditos = 20 negócios a
                mais.
              </p>
            </div>

            <Link to="/login" className="mt-6 block">
              <Button className="h-11 w-full cursor-pointer rounded-xl bg-blue-600 text-sm hover:bg-blue-700">
                Comprar créditos agora
              </Button>
            </Link>

            <p className="mt-3 text-center text-xs text-zinc-400">
              Pagamento único · Créditos não expiram
            </p>
          </div>
        </div>

        {/* FAQ rápido / garantia */}
        <p className="mt-10 text-center text-sm text-zinc-400">
          Dúvidas?{' '}
          <a
            href="mailto:contato@click-proposta.com.br"
            className="text-blue-500 underline underline-offset-2 hover:text-blue-600"
          >
            Fale com a gente
          </a>
          . Sem burocracia.
        </p>
      </div>
    </section>
  )
}
