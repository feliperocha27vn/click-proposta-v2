import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'
import { AlertCircle } from 'lucide-react'

interface AlertWithoutProposalProps {
    type?: 'budget' | 'proposal'
}

export function AlertWithoutProposal({
    type = 'proposal',
}: AlertWithoutProposalProps) {
    const isBudget = type === 'budget'

    return (
        <div className="space-y-4">
            <Alert className="mt-50">
                <AlertTitle className="flex items-center gap-2">
                    Atenção <AlertCircle />
                </AlertTitle>
                <AlertDescription>
                    {isBudget
                        ? 'Você ainda não tem nenhum orçamento. Clique no botão abaixo para criar um.'
                        : 'Você ainda não tem nenhuma proposta. Clique no botão abaixo para criar uma.'}
                </AlertDescription>
            </Alert>
            <Link to="/select-type-proposal" className="w-full">
                <Button className="w-full cursor-pointer">
                    {isBudget ? 'Novo orçamento' : 'Nova proposta'}
                </Button>
            </Link>
        </div>
    )
}
