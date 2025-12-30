import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { type CreateProposalDraftBody, createProposalDraft } from '@/http/api'
import { cn } from '@/lib/utils'
import { useMutation } from '@tanstack/react-query'
import { useNavigate, useParams } from '@tanstack/react-router'
import { Send } from 'lucide-react'
import { useForm } from 'react-hook-form'
import logo from '../../../../assets/logo.png'
import { AITextLoading } from './ai-text-loading'

export function ChatInputIa() {
  const { 'customer-id': customerId } = useParams({ strict: false })
  const navigate = useNavigate()
  const { register, handleSubmit, watch, resetField } =
    useForm<CreateProposalDraftBody>({
      defaultValues: {
        userPrompt: '',
      },
    })

  const userPrompt = watch('userPrompt')

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(handleCreateProposalDraft)()
    }
  }

  const { mutateAsync: createNewDraftProposalFn, isPending } = useMutation({
    mutationFn: async (userPrompt: string) => {
      if (!customerId) {
        throw new Error('Customer ID não encontrado')
      }
      return await createProposalDraft(customerId, { userPrompt })
    },
  })

  async function handleCreateProposalDraft(data: CreateProposalDraftBody) {
    try {
      await createNewDraftProposalFn(data.userPrompt)
      resetField('userPrompt')
      navigate({
        to: '/$new-proposal',
        params: { 'new-proposal': customerId || '' },
      })
    } catch (error) {
      console.error('Error creating proposal draft:', error)
    }
  }

  return (
    <div className="w-full xl:w-4/6 py-4">
      <div className="bg-black/5 dark:bg-white/5 rounded-2xl p-1.5 pt-4">
        <div className="flex items-center gap-2 mb-2.5 mx-2">
          <div className="flex-1 flex items-center justify-between gap-2">
            <h3 className="text-black dark:text-white/90 text-xs tracking-tighter">
              Click AI
            </h3>
            <AITextLoading isLoading={isPending} />
          </div>
        </div>
        <div className="relative">
          <form
            className="relative flex flex-col"
            onSubmit={handleSubmit(handleCreateProposalDraft)}
          >
            <div className="overflow-y-auto" style={{ maxHeight: '400px' }}>
              <Textarea
                {...register('userPrompt', {
                  required: true,
                })}
                placeholder={
                  'Para quem é a proposta? Qual problema você resolve e o que você vai entregar para solucioná-lo?'
                }
                className={cn(
                  'w-full rounded-xl rounded-b-none px-4 py-3 bg-black/5 dark:bg-white/5 border-none dark:text-white placeholder:text-black/70 dark:placeholder:text-white/70 resize-none focus-visible:ring-0 focus-visible:ring-offset-0',
                  'min-h-[72px]'
                )}
                onKeyDown={handleKeyDown}
              />
            </div>

            <div className="h-14 bg-black/5 dark:bg-white/5 rounded-b-xl flex items-center relative">
              <div className="flex items-center justify-between w-full px-3">
                <div className="flex items-center gap-2 size-14">
                  <img src={logo} alt="Logo do click proposta" />
                </div>

                <Button
                  type="submit"
                  variant={'ghost'}
                  disabled={!userPrompt?.trim() || isPending}
                  className="cursor-pointer w-4 h-4 dark:text-white transition-opacity duration-200 "
                >
                  <Send />
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
