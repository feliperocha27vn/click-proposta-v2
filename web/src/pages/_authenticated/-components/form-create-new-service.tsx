import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { createService } from '@/http/api'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { AlertCreateService } from './alerts-create-service'

interface CreateNewServiceFormData {
  name: string
  [key: string]: string
}

export default function FormCreateNewService() {
  const [inputsDescription, setInputsDescription] = useState<number[]>([])
  const [showAlert, setShowAlert] = useState(false)
  const [alertConfig, setAlertConfig] = useState({
    type: 'success' as 'success' | 'error',
    title: '',
    description: '',
    actionText: 'OK',
  })
  const { register, handleSubmit, reset } = useForm<CreateNewServiceFormData>()

  function handleAddInput(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    const newId = Date.now()
    setInputsDescription([...inputsDescription, newId])
  }

  async function onSubmit(data: CreateNewServiceFormData) {
    try {
      const descriptions = Object.keys(data)
        .filter(key => key.startsWith('description_'))
        .map(key => data[key])
        .filter(value => value && value.trim() !== '')

      const description = descriptions.join(';')

      const reply = await createService({
        name: data.name,
        description: description || undefined,
      })

      if (reply.statusCode === 201) {
        setAlertConfig({
          type: 'success',
          title: 'Serviço criado com sucesso!',
          description: 'Seu novo serviço foi cadastrado e já está disponível.',
          actionText: 'Confirmar',
        })
        setShowAlert(true)
        reset()
        setInputsDescription([])
      } else {
        setAlertConfig({
          type: 'error',
          title: 'Erro ao criar serviço',
          description:
            'Ocorreu um erro ao tentar criar o serviço. Tente novamente.',
          actionText: 'OK',
        })
        setShowAlert(true)
      }
    } catch (error) {
      console.error('Erro ao criar serviço:', error)
      setAlertConfig({
        type: 'error',
        title: 'Erro ao criar serviço',
        description: 'Ocorreu um erro inesperado. Tente novamente.',
        actionText: 'OK',
      })
      setShowAlert(true)
    }
  }

  function handleAlertAction() {
    if (alertConfig.type === 'success') {
      window.location.reload()
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="cursor-pointer">
          <Plus /> Cadastrar um novo serviço
        </Button>
      </DialogTrigger>
      <DialogContent>
        <div className="mb-2 flex flex-col items-center gap-2">
          <DialogHeader>
            <DialogTitle className="sm:text-center">
              Crie um novo serviço
            </DialogTitle>
            <DialogDescription className="sm:text-center">
              Preencha os detalhes do serviço.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <div className="*:not-first:mt-2">
            <div className="relative space-y-3">
              <Input
                className="peer"
                placeholder="Qual o nome do serviço?"
                type="text"
                aria-label="Nome do serviço"
                {...register('name')}
              />
              <div className="flex gap-2 flex-col">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-light">
                    Gostaria de inserir algum detalhe sobre o serviço?
                  </p>
                  <Button onClick={handleAddInput} className="cursor-pointer">
                    <Plus />
                  </Button>
                </div>
                {inputsDescription.map((id, index) => (
                  <Input
                    key={id}
                    placeholder="Detalhes do serviço"
                    {...register(`description_${index}`)}
                  />
                ))}
              </div>
            </div>
          </div>
          <Button type="submit" className="w-full cursor-pointer">
            Criar Serviço
          </Button>
        </form>

        <AlertCreateService
          isOpen={showAlert}
          onClose={() => setShowAlert(false)}
          type={alertConfig.type}
          title={alertConfig.title}
          description={alertConfig.description}
          actionText={alertConfig.actionText}
          onAction={handleAlertAction}
        />
      </DialogContent>
    </Dialog>
  )
}
