import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Link, useNavigate } from '@tanstack/react-router'
import { CheckCircle, Loader2 } from 'lucide-react'

interface ProposalStatusModalProps {
  isOpen: boolean
  isLoading: boolean
  isSuccess: boolean
  error?: string
  onClose: () => void
}

export function ProposalStatusModal({
  isOpen,
  isLoading,
  isSuccess,
  error,
  onClose,
}: ProposalStatusModalProps) {
  const navigate = useNavigate()

  function handleViewProposals() {
    navigate({ to: '/proposals' })
    onClose()
  }

  // function handleViewCreatedProposal() {
  //   // Futuramente implementar rota para a proposta criada
  //   console.log('Ir para proposta criada')
  //   onClose()
  // }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isLoading && <Loader2 className="h-5 w-5 animate-spin" />}
            {isSuccess && <CheckCircle className="h-5 w-5 text-green-600" />}
            {isLoading && 'Criando proposta...'}
            {isSuccess && 'Proposta criada com sucesso!'}
            {error && 'Erro ao criar proposta'}
          </DialogTitle>

          <DialogDescription>
            {isLoading && 'Aguarde enquanto processamos sua proposta...'}
            {isSuccess && 'Sua proposta foi criada e já está disponível.'}{' '}
          </DialogDescription>
        </DialogHeader>

        {isLoading && (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-8 w-8 animate-spin text-sky-600" />
          </div>
        )}

        {isSuccess && (
          <DialogFooter className="flex-col sm:flex-col gap-2">
            <Button onClick={handleViewProposals} className="w-full">
              Ver minhas propostas
            </Button>
          </DialogFooter>
        )}

        {error && (
          <>
            <DialogDescription>
              Parabéns pelo seu trabalho! Você já criou o máximo de propostas
              disponíveis no plano gratuito. Para continuar criando sem limites
              e ter acesso a recursos exclusivos, que tal conhecer nossos outros
              planos?
            </DialogDescription>
            <DialogFooter>
              <Link className="w-full" to="/plans">
                <Button onClick={onClose} className="w-full">
                  Conhecer nossos planos
                </Button>
              </Link>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
