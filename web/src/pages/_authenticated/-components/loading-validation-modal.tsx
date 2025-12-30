import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"

interface LoadingValidationModalProps {
    isOpen: boolean
}

export function LoadingValidationModal({ isOpen }: LoadingValidationModalProps) {
    return (
        <Dialog open={isOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-center">Verificando informações</DialogTitle>
                    <DialogDescription className="text-center">
                        Aguarde enquanto validamos seu perfil...
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col items-center justify-center py-8 space-y-4">
                    <div className="flex space-x-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
                        <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>

                    <div className="w-full space-y-3">
                        <Skeleton className="h-4 w-3/4 mx-auto bg-zinc-300" />
                        <Skeleton className="h-4 w-1/2 mx-auto bg-zinc-300" />
                        <Skeleton className="h-4 w-2/3 mx-auto bg-zinc-300" />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}