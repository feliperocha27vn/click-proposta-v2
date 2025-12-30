import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@/components/ui/sheet"
import { Link } from "@tanstack/react-router"

export function MenuMobile() {
    return (
        <div className="md:hidden">
            <Sheet>
                <SheetTrigger className="space-y-1">
                    <div className="h-0.5 w-5 bg-zinc-800 rounded-lg" />
                    <div className="h-0.5 w-5 bg-zinc-800 rounded-lg" />
                    <div className="h-0.5 w-5 bg-zinc-800 rounded-lg" />
                </SheetTrigger>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>Click Proposta</SheetTitle>
                        <SheetDescription>
                            Acesse sua conta ou crie uma nova para continuar.
                        </SheetDescription>
                        <nav className="space-y-2">
                            <Link to='/login'>
                                <p className="font-light text-lg cursor-pointer">Login</p>
                            </Link>
                            <Link to='/login'>
                                <p className="font-light text-lg cursor-pointer">Inscreva-se</p>
                            </Link>
                        </nav>
                    </SheetHeader>
                </SheetContent>
            </Sheet>
        </div>
    )
}
