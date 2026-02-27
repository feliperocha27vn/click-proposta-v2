import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface DialogAddressPdfProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DialogAddressPdf({
  open,
  onOpenChange,
}: DialogAddressPdfProps) {
  // Como a API ficará por sua conta, deixei um form com onSubmit genérico
  const handleSaveAddress = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Implementar chamada da API aqui
    console.log('Salvar endereço')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold tracking-tight">
            Complete seu cadastro
          </DialogTitle>
          <DialogDescription className="text-zinc-500">
            Precisamos do seu endereço para gerar e formatar corretamente os
            orçamentos em PDF.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSaveAddress} className="space-y-6 py-4">
          <div className="space-y-4">
            {/* Rua e Número na mesma linha para melhor aproveitamento do espaço */}
            <div className="grid grid-cols-[1fr_100px] gap-4">
              <div className="space-y-2">
                <Label htmlFor="rua" className="text-sm font-medium">
                  Rua
                </Label>
                <Input
                  id="rua"
                  name="rua"
                  placeholder="Ex: Av. Paulista"
                  required
                  className="focus-visible:ring-emerald-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="numero" className="text-sm font-medium">
                  Número
                </Label>
                <Input
                  id="numero"
                  name="numero"
                  placeholder="Ex: 1000"
                  required
                  className="focus-visible:ring-emerald-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bairro" className="text-sm font-medium">
                Bairro
              </Label>
              <Input
                id="bairro"
                name="bairro"
                placeholder="Ex: Centro"
                required
                className="focus-visible:ring-emerald-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cidade" className="text-sm font-medium">
                Cidade
              </Label>
              <Input
                id="cidade"
                name="cidade"
                placeholder="Ex: São Paulo - SP"
                required
                className="focus-visible:ring-emerald-500"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
            >
              Salvar endereço
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
