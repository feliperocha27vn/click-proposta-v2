import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useUpdateProposal } from '@/gen/hooks/ProposalsHooks/useUpdateProposal'
import type { UpdateProposalMutationRequest } from '@/gen/types/UpdateProposal'
import { useId } from 'react'
import { useForm } from 'react-hook-form'

interface FormEditProposalProps {
  isOpen: boolean
  onClose: () => void
  proposalId: string
  field: keyof UpdateProposalMutationRequest
  currentValue: string
  fieldLabel: string
  onUpdate: (field: keyof UpdateProposalMutationRequest, newValue: string) => void
}

export function FormEditProposal({
  isOpen,
  onClose,
  proposalId,
  field,
  currentValue,
  fieldLabel,
  onUpdate,
}: FormEditProposalProps) {
  const { register, handleSubmit, reset } = useForm<{ value: string }>({
    defaultValues: { value: currentValue },
  })
  const { mutateAsync: updateProposalMutate, isPending: isSubmitting } = useUpdateProposal()
  const inputId = useId()

  async function onSubmit(data: { value: string }) {
    try {
      await updateProposalMutate({
        proposalId,
        data: {
          [field]: data.value,
        },
      })

      // Chama o callback para atualizar o estado local
      onUpdate(field, data.value)

      // Fecha o modal
      onClose()
      reset()
    } catch (error) {
      console.error('Erro ao atualizar proposta:', error)
      alert('Erro ao atualizar. Tente novamente.')
    }
  }

  function handleClose() {
    reset({ value: currentValue })
    onClose()
  }

  const isTextarea =
    field === 'welcomeDescription' ||
    field === 'whyUs' ||
    field === 'challenge' ||
    field === 'solution' ||
    field === 'results'

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar {fieldLabel}</DialogTitle>
          <DialogDescription>
            Faça as alterações desejadas no campo abaixo.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor={inputId} className="mb-5">
              {fieldLabel}
            </Label>
            {isTextarea ? (
              <Textarea
                id={inputId}
                {...register('value', { required: true })}
                className="min-h-25"
                placeholder={`Digite ${fieldLabel.toLowerCase()}`}
              />
            ) : (
              <Input
                id={inputId}
                {...register('value', { required: true })}
                placeholder={`Digite ${fieldLabel.toLowerCase()}`}
              />
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
