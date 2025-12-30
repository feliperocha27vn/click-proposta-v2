import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import type { FetchManyServices200ServicesItem } from "@/http/api"
import { Plus, X } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from 'react-hook-form'
import { AlertCreateService } from "./alerts-create-service"

interface EditServiceFormData {
    name: string;
    [key: string]: string;
}

interface FormEditServiceProps {
    isOpen: boolean
    onClose: () => void
    service: FetchManyServices200ServicesItem | null
    onUpdate: (serviceId: string, data: { name: string; description?: string }) => Promise<void>
}

export default function FormEditService({ isOpen, onClose, service, onUpdate }: FormEditServiceProps) {
    const [inputsDescription, setInputsDescription] = useState<number[]>([])
    const [showAlert, setShowAlert] = useState(false)
    const [alertConfig, setAlertConfig] = useState({
        type: 'success' as 'success' | 'error',
        title: '',
        description: '',
        actionText: 'OK'
    })
    const { register, handleSubmit, reset, setValue } = useForm<EditServiceFormData>()

    // Popula o formulário quando o serviço é carregado
    useEffect(() => {
        if (service && isOpen) {
            setValue('name', service.name)

            // Se há descrição, quebra por ';' e cria inputs
            if (service.description) {
                const descriptions = service.description.split(';').filter((desc: string) => desc.trim() !== '')
                const descriptionIds = descriptions.map(() => Date.now() + Math.random())
                setInputsDescription(descriptionIds)

                // Define os valores das descrições
                descriptions.forEach((desc: string, index: number) => {
                    setValue(`description_${index}`, desc.trim())
                })
            } else {
                setInputsDescription([])
            }
        }
    }, [service, isOpen, setValue])

    function handleAddInput(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault()
        const newId = Date.now()
        setInputsDescription([...inputsDescription, newId])
    }

    function handleRemoveInput(indexToRemove: number) {
        const newInputs = inputsDescription.filter((_, index) => index !== indexToRemove)
        setInputsDescription(newInputs)
    }

    async function onSubmit(data: EditServiceFormData) {
        if (!service) return

        try {
            const descriptions = Object.keys(data)
                .filter(key => key.startsWith('description_'))
                .map(key => data[key])
                .filter(value => value && value.trim() !== '')

            const description = descriptions.join(';')

            await onUpdate(service.id, {
                name: data.name,
                description: description || undefined,
            })

            setAlertConfig({
                type: 'success',
                title: 'Serviço atualizado com sucesso!',
                description: 'As alterações foram salvas com sucesso.',
                actionText: 'OK'
            })
            setShowAlert(true)

        } catch (error) {
            console.error('Erro ao atualizar serviço:', error)
            setAlertConfig({
                type: 'error',
                title: 'Erro ao atualizar serviço',
                description: 'Ocorreu um erro ao tentar atualizar o serviço. Tente novamente.',
                actionText: 'OK'
            })
            setShowAlert(true)
        }
    }

    function handleAlertAction() {
        setShowAlert(false)
        if (alertConfig.type === 'success') {
            onClose()
            reset()
            setInputsDescription([])
        }
    }

    function handleClose() {
        if (!showAlert) {
            onClose()
            reset()
            setInputsDescription([])
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            if (!open && !showAlert) {
                handleClose()
            }
        }}>
            <DialogContent>
                <div className="mb-2 flex flex-col items-center gap-2">
                    <DialogHeader>
                        <DialogTitle className="sm:text-center">
                            Editar serviço
                        </DialogTitle>
                        <DialogDescription className="sm:text-center">
                            Atualize os detalhes do serviço.
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
                                {...register('name', { required: true })}
                            />
                            <div className="flex gap-2 flex-col">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-light">Gostaria de inserir algum detalhe sobre o serviço?</p>
                                    <Button onClick={handleAddInput} className="cursor-pointer" type="button">
                                        <Plus />
                                    </Button>
                                </div>
                                {inputsDescription.map((id, index) => (
                                    <div key={id} className="flex gap-2 items-center">
                                        <Input
                                            placeholder="Detalhes do serviço"
                                            {...register(`description_${index}`)}
                                            className="flex-1"
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleRemoveInput(index)}
                                            className="cursor-pointer px-2"
                                        >
                                            <X size={14} />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button type="button" variant="outline" className="flex-1 cursor-pointer" onClick={handleClose}>
                            Cancelar
                        </Button>
                        <Button type="submit" className="flex-1 cursor-pointer">
                            Salvar Alterações
                        </Button>
                    </div>
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
