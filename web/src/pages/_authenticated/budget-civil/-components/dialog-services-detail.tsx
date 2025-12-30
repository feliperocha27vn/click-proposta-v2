import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import type { FetchManyServices200ServicesItem } from '@/http/api'

interface DialogServicesDetailProps {
    closeDialog: boolean
    setCloseDialog: (value: boolean) => void
    servicesData?: FetchManyServices200ServicesItem[]
    handleSelectService: (item: FetchManyServices200ServicesItem) => void
}

export function DialogServicesDetail({
    closeDialog,
    setCloseDialog,
    servicesData,
    handleSelectService,
}: DialogServicesDetailProps) {
    return (
        <Dialog open={closeDialog} onOpenChange={setCloseDialog}>
            <DialogTrigger asChild>
                <Button className="w-full">Selecionar um serviço</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Selecionar um serviço</DialogTitle>
                <DialogTitle className="text-sm text-muted-foreground font-light">
                    Após selecionar, pode alterar a qualquer momento
                </DialogTitle>
                <DialogDescription>
                    Deseja usar este serviço no orçamento?
                </DialogDescription>
                <div className="py-2 flex flex-col gap-y-2">
                    {servicesData?.map(item => (
                        <button
                            key={item.id}
                            className="border border-zinc-200 p-2 rounded-lg bg-zinc-100 shadow text-start"
                            type="button"
                            onClick={() => handleSelectService(item)}
                        >
                            {item.name}
                        </button>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    )
}
