import { Link } from '@tanstack/react-router'

export function LandingFooter() {
  return (
    <footer className="w-full border-t border-zinc-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-[8%] xl:px-[10%]">
        <div className="flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
          {/* Brand */}
          <div>
            <p className="text-lg font-semibold text-zinc-900">
              <span className="text-blue-600">Click</span>.proposta
            </p>
            <p className="mt-1 max-w-xs text-sm text-zinc-400">
              Transformando ideias em propostas vencedoras.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-12 text-sm text-zinc-500">
            <div className="space-y-2">
              <p className="font-medium text-zinc-800">Produto</p>
              <ul className="space-y-1.5">
                <li>
                  <a
                    href="#how-it-works"
                    className="transition-colors hover:text-zinc-900"
                  >
                    Como funciona
                  </a>
                </li>
                <li>
                  <a
                    href="#pricing"
                    className="transition-colors hover:text-zinc-900"
                  >
                    Preços
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <p className="font-medium text-zinc-800">Legal</p>
              <ul className="space-y-1.5">
                <li>
                  <Link
                    to="/privacy-policy"
                    className="transition-colors hover:text-zinc-900"
                  >
                    Política de Privacidade
                  </Link>
                </li>
                <li>
                  <Link
                    to="/terms-of-service"
                    className="transition-colors hover:text-zinc-900"
                  >
                    Termos de Serviço
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-zinc-100 pt-6">
          <p className="text-xs text-zinc-400">
            © {new Date().getFullYear()} Click Proposta. Todos os direitos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
