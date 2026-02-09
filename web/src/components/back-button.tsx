import { Button } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

interface BackButtonProps {
    to: string
    className?: string
}

export function BackButton({ to, className = 'mb-4' }: BackButtonProps) {
    return (
        <Link to={to} className="sm:block xl:hidden">
            <Button className={className}>
                <ArrowLeft /> Voltar
            </Button>
        </Link>
    )
}
