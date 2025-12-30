import { Trash2 } from "lucide-react"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface AlertDeleteServiceProps {
    isOpen: boolean
    onClose: () => void
    serviceName: string
    onConfirm: () => void
}

export function AlertDeleteService({
    isOpen,
    onClose,
    serviceName,
    onConfirm
}: AlertDeleteServiceProps) {
    const handleConfirm = () => {
        onConfirm()
        onClose()
    }

    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent>
                <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
                    <div
                        className="flex size-9 shrink-0 items-center justify-center rounded-full border border-red-200 bg-red-50"
                        aria-hidden="true"
                    >
                        <Trash2 className="text-red-600" size={16} />
                    </div>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Excluir serviço</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem certeza que deseja excluir o serviço "{serviceName}"? Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel className="cursor-pointer">Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleConfirm}
                        className="cursor-pointer"
                    >
                        Excluir
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
