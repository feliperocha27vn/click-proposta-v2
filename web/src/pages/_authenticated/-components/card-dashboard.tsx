import { Button } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'

interface CardDashboardProps {
    title: string
    titleButton: string
    link: string
    icon: React.ReactNode
    image?: string
}

export function CardDashboard({
    title,
    titleButton,
    link,
    image,
    icon,
}: CardDashboardProps) {
    return (
        <div className="flex flex-col border rounded-2xl px-3 py-4 justify-between h-50 xl:h-75">
            <div className="xl:hidden">{icon}</div>
            <img
                src={image}
                alt="Pessoa preenchendo formulario"
                className="hidden xl:block w-full object-cover h-45 rounded-t-2xl"
            />
            <div className="space-y-2">
                <div className="font-medium">{title}</div>
                <Link to={link}>
                    <Button className="w-full cursor-pointer">{titleButton}</Button>
                </Link>
            </div>
        </div>
    )
}
