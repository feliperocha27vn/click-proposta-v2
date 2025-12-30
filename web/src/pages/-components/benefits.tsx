import { CheckCircle } from "lucide-react"

export function Benefits() {
    const benefitsList = [
        {
            id: 1,
            text: 'Economize tempo precioso na elaboração de documentos.'
        },
        {
            id: 2,
            text: 'Apresente uma imagem mais profissional para seus clientes.'
        },
        {
            id: 3,
            text: 'Aumente suas taxas de conversão com propostas claras e atraentes.'
        }
    ]

    return (
        <div className="space-y-2 xl:space-y-4">
            {benefitsList.map((benefit) => (
                <p key={benefit.id} className='xl:bg-zinc-100 xl:shadow xl:rounded-xl xl:min-h-16 xl:px-5 text-sm xl:text-base flex items-center gap-x-3 text-muted-foreground'>
                    <CheckCircle size={28} className="text-black" />
                    {benefit.text}
                </p>
            ))}
        </div>
    )
}