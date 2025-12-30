import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Link } from '@tanstack/react-router'
import { Briefcase, DollarSign, FileArchive, House } from 'lucide-react'

export function MenuMobileAuth() {
  return (
    <div className="md:hidden">
      <Sheet>
        <SheetTrigger className="space-y-1">
          <div className="h-[3px] rounded-xl w-[20px] bg-zinc-800" />
          <div className="h-[3px] rounded-xl w-[15px] bg-zinc-800" />
          <div className="h-[3px] rounded-xl w-[10px] bg-zinc-800" />
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle className="mb-6 text-xl">
              <span className="font-semibold text-primary">Click</span>
              <span className="font-normal">.proposta</span>
            </SheetTitle>
            <nav className="flex flex-col gap-y-4 text-lg">
              <Link to="/dashboard" className="flex items-center gap-x-2">
                <House />
                <span>Painel</span>
              </Link>
              <Link to="/proposals" className="flex items-center gap-x-2">
                <FileArchive />
                <span>Propostas</span>
              </Link>
              <Link to="/my-services" className="flex items-center gap-x-2">
                <Briefcase />
                <span>Meus Serviços</span>
              </Link>
              <Link to="/plans" className="flex items-center gap-x-2">
                <DollarSign />
                <span>Planos</span>
              </Link>
            </nav>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  )
}
