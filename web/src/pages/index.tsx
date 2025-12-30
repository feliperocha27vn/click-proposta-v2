import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth-context'
import { createFileRoute, Link, Navigate } from '@tanstack/react-router'
import logo from '../assets/logo.png'
import { Benefits } from './-components/benefits'
import { Cards } from './-components/cards'
import { MenuMobile } from './-components/menu-mobile'

export const Route = createFileRoute('/')({
    component: RouteComponent,
})

function RouteComponent() {
    const { session, loading } = useAuth()

    // Se está carregando, mostra loading
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    // Se usuário está autenticado, redireciona para dashboard
    if (session) {
        return <Navigate to="/dashboard" replace />
    }

    const imagePersonReadPaper = "https://lh3.googleusercontent.com/aida-public/AB6AXuCyh_fsJoAQ9h7hrxi2nWoZd8gexHzcxyAi6R8cQgqcMwtU17gEYRv3rMmX_Bzj_4_gGFdQNREtWVMhYvFwEbBTYqOBguc_NIowGzTr-mgfOItGlgUB-2n54CiygxbPKdccj5cJDkntFRgia9wVGuhtFWKLe80y_QMmBy8ml0m4m12uEjwEqxNKO6fBW3SHBsexJutkyt-ka1oWiX2j0Xhr3NQG_L2hphW4JWM-_QBsf2YJtWe4ogZJ-sS-BzXT0z3308aHVriHd-9B"

    return (
        <div className='flex flex-col items-center w-full min-h-screen bg-zinc-50'>
            <div className='h-min-screen bg-teal-50 text-zinc-800 w-full relative'>
                <div
                    className="absolute inset-0 z-0"
                    style={{
                        background: "#ffffff",
                        backgroundImage: `
                        radial-gradient(
                        circle at top right,
                        rgba(56, 193, 182, 0.5),
                        transparent 70%
                        )
                    `,
                        filter: "blur(80px)",
                        backgroundRepeat: "no-repeat",
                    }}
                />
                <div className='w-full max-w-[1280px] mx-auto relative z-10 p-4 md:px-[8%] xl:px-[10%] py-8'>
                    <header className="w-full flex justify-between items-center">
                        <div className='text-xl'>   
                            <span className='font-semibold text-primary'>Click</span>
                            <span className='font-normal'>.proposta</span>
                        </div>
                        <MenuMobile />
                        <div className='hidden md:block space-x-4'>
                            <Link to='/login'>
                                <Button variant='ghost' className='xl:text-base cursor-pointer xl:p-6'>Login</Button>
                            </Link>
                            <Link to='/login'>
                                <Button className='xl:text-base xl:p-6 xl:rounded-xl cursor-pointer'>Inscreva-se</Button>
                            </Link>
                        </div>
                    </header>
                    <div className='w-full mt-16 md:mt-20 text-center space-y-6 xl:space-y-10 md:flex md:flex-col md:items-center'>
                        <p className='text-3xl md:text-4xl xl:text-4xl font-bold leading-tight md:w-9/12 xl:w-8/12'>Deixe a IA escrever. Foque em fechar o negócio.</p>
                        <p className='font-light md:text-xl xl:text-lg xl:w-8/12'>Crie propostas profissionais que impressionam seus clientes. Comece de graça e eleve o nível do seu negócio.</p>
                    </div>
                    <div className='md:w-full md:flex md:justify-center'>
                        <Link to='/login'>
                            <Button className='mt-12 w-full md:px-6 md:text-lg xl:p-6 xl:px-8 xl:text-base xl:w-full cursor-pointer'>Comece de graça</Button>
                        </Link>
                    </div>
                </div>
            </div>
            <main className='relative z-10 flex flex-col items-center w-full mt-24'>
                <div className='w-full max-w-[1280px] mx-auto p-4 xl:p-6'>
                    <h2 className='text-lg font-bold md:text-2xl xl:text-2xl text-center mb-6'>Como funciona?</h2>
                    <h3 className='text-sm font-light text-zinc-600 text-center mb-12 md:text-base xl:text-lg'>Crie propostas profissionais em três passos simples.</h3>
                    <Cards />
                    <div className='mt-20 space-y-8 md:hidden'>
                        <h2 className='font-bold text-xl'>Proposta Rápida: O seu atalho para o sucesso.</h2>
                        <p className='font-light text-zinc-600 text-sm'>Um software como serviço (SaaS) focado em ajudar profissionais e pequenas empresas a criar e enviar propostas de trabalho de forma rápida e profissional.</p>
                        <img src={imagePersonReadPaper} alt="Pessoa lendo proposta" className='w-full max-w-md mx-auto rounded-xl shadow' />
                        <Benefits />
                    </div>
                    <div className='mt-20 space-y-8 hidden md:flex md:gap-8 xl:gap-12 xl:justify-between xl:w-full'>
                        <div className='flex flex-col items-start space-y-6 w-full xl:w-6/12'>
                            <h2 className='font-bold text-xl xl:text-xl'>Proposta Rápida: O seu atalho para o sucesso.</h2>
                            <p className='font-light text-zinc-600 text-sm xl:text-base'>Um software como serviço (SaaS) focado em ajudar profissionais e pequenas empresas a criar e enviar propostas de trabalho de forma rápida e profissional.</p>
                            <Benefits />
                        </div>
                        <img src={imagePersonReadPaper} alt="Pessoa lendo proposta" className='w-full mx-auto rounded-xl shadow md:w-6/12' />
                    </div>
                </div>
            </main>
            <footer className='bg-zinc-800 text-white w-full flex flex-col mt-24'>
                <div className='w-full max-w-[1280px] mx-auto p-4 xl:p-6'>
                    <div className='grid grid-cols-2 gap-8'>
                        <div className='space-y-4'>
                            <h3 className='font-bold xl:text-lg'>Click Proposta</h3>
                            <p className='font-light text-zinc-400 text-sm xl:text-sm'>
                                Transformando suas ideias em propostas vencedoras.
                            </p>
                        </div>
                        <div className='space-y-4'>
                            <h3 className='font-bold xl:text-lg'>Produto</h3>
                            <p className='font-light text-zinc-400 text-sm xl:text-sm'>
                                Preços
                            </p>
                        </div>
                    </div>
                    <div className='w-11/12 h-[1px] bg-zinc-600 mx-auto my-8' />
                    <p className='text-[10px] text-zinc-600 xl:text-sm'>© 2024 Click Proposta. Todos os direitos reservados.</p>
                </div>
            </footer>
        </div>
    )
}
