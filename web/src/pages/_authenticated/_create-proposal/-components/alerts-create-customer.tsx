import { CircleAlertIcon, CircleCheckIcon } from "lucide-react"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface AlertCreateCustomerProps {
    isOpen: boolean
    onClose: () => void
    type: 'success' | 'error'
    title: string
    description: string
    actionText?: string
    onAction?: () => void
}

export function AlertCreateCustomer({
    isOpen,
    onClose,
    type,
    title,
    description,
    actionText = "OK",
    onAction
}: AlertCreateCustomerProps) {
    const handleAction = () => {
        if (onAction) {
            onAction()
        }
        onClose()
    }

    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent>
                <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
                    <div
                        className={`flex size-9 shrink-0 items-center justify-center rounded-full border ${type === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                            }`}
                        aria-hidden="true"
                    >
                        {type === 'success' ? (
                            <CircleCheckIcon className="text-green-600" size={16} />
                        ) : (
                            <CircleAlertIcon className="text-red-600" size={16} />
                        )}
                    </div>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{title}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {description}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                </div>
                <AlertDialogFooter>
                    <AlertDialogAction onClick={handleAction}>
                        {actionText}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
