import { Button } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

export function LandingHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="relative z-50 w-full border-b border-zinc-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-[8%] xl:px-[10%]">
        {/* Logo */}
        <a href="/" className="text-xl font-semibold">
          <span className="text-blue-600">Click</span>
          <span className="text-zinc-800">.proposta</span>
        </a>

        {/* Nav desktop */}
        <nav className="hidden items-center gap-8 text-sm text-zinc-600 md:flex">
          <a
            href="#how-it-works"
            className="transition-colors hover:text-zinc-900"
          >
            Como funciona
          </a>
          <a href="#pricing" className="transition-colors hover:text-zinc-900">
            Preços
          </a>
        </nav>

        {/* CTAs desktop */}
        <div className="hidden items-center gap-3 md:flex">
          <Link to="/login">
            <Button
              variant="ghost"
              size="sm"
              className="cursor-pointer text-sm"
            >
              Entrar
            </Button>
          </Link>
          <Link to="/login">
            <Button size="sm" className="cursor-pointer rounded-lg text-sm">
              Começar grátis
            </Button>
          </Link>
        </div>

        {/* Burger mobile */}
        <button
          type="button"
          onClick={() => setOpen(p => !p)}
          className="rounded-lg p-2 text-zinc-600 transition-colors hover:bg-zinc-100 md:hidden"
          aria-label="Menu"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Menu mobile */}
      {open && (
        <div className="border-t border-zinc-100 bg-white px-4 pb-6 pt-4 md:hidden">
          <nav className="flex flex-col gap-4 text-sm text-zinc-700">
            <a href="#how-it-works" onClick={() => setOpen(false)}>
              Como funciona
            </a>
            <a href="#pricing" onClick={() => setOpen(false)}>
              Preços
            </a>
            <Link to="/login" onClick={() => setOpen(false)}>
              <Button className="mt-2 h-10 w-full cursor-pointer rounded-xl text-sm">
                Começar grátis
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
