import { Cards } from './cards'

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="w-full bg-white py-20 md:py-28 relative overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-4 md:px-[8%] xl:px-[10%] relative z-10">
        <div className="mb-8 md:mb-12 text-center">
          <span className="mb-4 inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-blue-600">
            Como funciona
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 md:text-4xl lg:text-5xl">
            Três passos para a proposta perfeita
          </h2>
          <p className="mt-4 text-zinc-500 md:text-lg max-w-2xl mx-auto">
            Processo ágil e moderno para você fechar mais negócios, sem estresse
            e complicação.
          </p>
        </div>

        <Cards />
      </div>
    </section>
  )
}
