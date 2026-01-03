import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'
import { AlertCircle } from 'lucide-react'

export function AlertWithoutProposal() {
    return (
        <div className="space-y-4">
            <Alert className="mt-50">
                <AlertTitle className="flex items-center gap-2">
                    Atenção <AlertCircle />
                </AlertTitle>
                <AlertDescription>
                    Você ainda não tem nenhuma proposta. Clique no botão "Nova proposta"
                    para criar uma.
                </AlertDescription>
            </Alert>
            <Link to="/select-type-proposal" className="w-full">
                <Button className="w-full">Nova proposta</Button>
            </Link>
        </div>
    )
}
