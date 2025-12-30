import { AnimatedGroup } from "@/components/ui/animated-group"
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { Mail, ScrollText, Settings } from "lucide-react"

export function Cards() {
    const cardsIconText = [
        {
            id: '1',
            icon: <ScrollText className="size-10 xl:size-14" />,
            title: 'Preencha o Formulário',
            description: 'Um formulário online intuitivo coleta informações do seu cliente, escopo, preços e prazos.',
        },
        {
            id: '2',
            icon: <Settings className="size-10 xl:size-14" />,
            title: 'Gere a Proposta',
            description: 'As informações são transformadas automaticamente em uma proposta online profissional.',
        },
        {
            id: '3',
            icon: <Mail className="size-10 xl:size-14" />,
            title: 'Envie e Impressione',
            description: 'Sua proposta está pronta para ser enviada, ajudando você a fechar mais negócios.',
        }
    ]


    return (
        <AnimatedGroup
            variants={{
                container: {
                    visible: {
                        transition: {
                            staggerChildren: 0.05,
                        },
                    },
                },
                item: {
                    hidden: {
                        opacity: 0,
                        filter: 'blur(12px)',
                        y: -60,
                        rotateX: 90,
                    },
                    visible: {
                        opacity: 1,
                        filter: 'blur(0px)',
                        y: 0,
                        rotateX: 0,
                        transition: {
                            type: 'spring',
                            bounce: 0.3,
                            duration: 1,
                        },
                    },
                },
            }}
            className="w-full space-y-7 md:grid md:grid-cols-3 md:gap-3 md:space-y-0">
            {cardsIconText.map(card => (
                <Card className="@container/card text-center h-full" key={card.id}>
                    <CardHeader className="flex flex-col items-center justify-center space-y-0.5 xl:space-y-1 h-full">
                        {card.icon}
                        <CardTitle className="md:text-lg xl:text-xl font-semibold tabular-nums">
                            {card.title}
                        </CardTitle>
                        <CardDescription className="xl:text-base">{card.description}</CardDescription>
                    </CardHeader>
                </Card>
            ))}
        </AnimatedGroup>
    )
}