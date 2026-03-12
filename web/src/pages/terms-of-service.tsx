import { createFileRoute } from '@tanstack/react-router'
import { LandingFooter } from './-components/landing-footer'

export const Route = createFileRoute('/terms-of-service')({
  component: TermsOfService,
})

function TermsOfService() {
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col selection:bg-blue-200">
      {/* Header Area */}
      <div className="bg-zinc-900 py-24 px-6 md:px-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        <div className="relative max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">Termos de Serviço</h1>
          <p className="text-zinc-400 text-lg">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
        </div>
      </div>

      {/* Content Area */}
      <main className="flex-1 max-w-4xl mx-auto px-6 py-16 w-full text-zinc-800">
        <div className="prose prose-zinc max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-blue-600 hover:prose-a:text-blue-500 prose-p:leading-relaxed prose-li:leading-relaxed">
          <p className="text-lg text-zinc-600 mb-8 font-medium">
            Bem-vindo à Click Proposta. Ao utilizar nosso sistema, você concorda com as regras e condições descritas neste documento.
          </p>

          <h2 className="text-2xl mt-12 mb-6">1. Uso da Plataforma</h2>
          <p>
            A Click Proposta é um software projetado para facilitar a criação, gestão e envio de propostas comerciais. Ao criar uma conta, você se compromete a:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-8">
            <li>Fornecer informações cadastrais verdadeiras e mantê-las atualizadas.</li>
            <li>Manter a confidencialidade das suas credenciais de acesso (login e senha).</li>
            <li>Não utilizar o sistema para fins ilícitos, fraudulentos ou que violem os direitos de terceiros.</li>
          </ul>

          <h2 className="text-2xl mt-12 mb-6">2. Assinaturas, Pagamentos e Cancelamentos</h2>
          <p>
            O uso das funcionalidades premium da plataforma está sujeito à contratação de um de nossos planos de assinatura.
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-8">
            <li><strong>Processamento:</strong> Todos os pagamentos, renovações e reembolsos são processados de forma segura através de nossa integração com a <strong>Stripe</strong>.</li>
            <li><strong>Renovação Automática:</strong> Salvo disposição em contrário, os planos recorrentes são renovados automaticamente.</li>
            <li><strong>Cancelamento:</strong> Você pode cancelar sua assinatura a qualquer momento através do painel de controle. O cancelamento interrompe cobranças futuras, mas não gera reembolso proporcional pelos dias não utilizados no ciclo vigente.</li>
            <li><strong>Créditos:</strong> Se o seu plano possuir um sistema de créditos para uso de inteligência artificial ou envio de mensagens, estes créditos estão sujeitos à validade e regras de renovação do plano escolhido.</li>
          </ul>

          <h2 className="text-2xl mt-12 mb-6">3. Integração com APIs de Terceiros e Limitações</h2>
          <p>
            Nossa plataforma utiliza integrações avançadas para fornecer serviços de automação, incluindo o WhatsApp (via Evolution API) e processamento de linguagem natural (via Google Gemini API).
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-8">
            <li><strong>Disponibilidade:</strong> A Click Proposta não se responsabiliza por instabilidades, quedas ou mudanças de políticas ocorridas nas APIs de terceiros (como indisponibilidade temporária do WhatsApp ou lentidão na IA).</li>
            <li><strong>Uso Aceitável do WhatsApp:</strong> O uso do bot do WhatsApp integrado à Click Proposta deve respeitar as diretrizes da Meta. Práticas de spam, envio de mensagens não solicitadas em massa ou violações dos termos do WhatsApp podem resultar no bloqueio do seu número, pelo qual a Click Proposta <strong>não</strong> assume responsabilidade.</li>
          </ul>

          <h2 className="text-2xl mt-12 mb-6">4. Propriedade Intelectual</h2>
          <p className="mb-8">
            A estrutura, código, logotipos e toda a tecnologia subjacente ao Click Proposta são de propriedade exclusiva da nossa empresa. A assinatura da plataforma concede a você uma licença de uso limitada, revogável e não exclusiva, não configurando venda ou transferência da propriedade do software.
          </p>

          <h2 className="text-2xl mt-12 mb-6">5. Limitação de Responsabilidade</h2>
          <p className="mb-8">
            Nós nos esforçamos para manter a plataforma sempre online, segura e livre de erros. No entanto, o Click Proposta é fornecido "no estado em que se encontra". Não seremos responsáveis por danos indiretos, lucros cessantes ou perda de dados decorrentes do uso contínuo, interrupções ou incapacidade de uso do serviço.
          </p>

          <p className="mt-12 text-zinc-500 italic">
            Reservamo-nos o direito de modificar estes Termos de Serviço a qualquer momento. Modificações significativas serão comunicadas através da plataforma ou por e-mail.
          </p>
        </div>
      </main>

      <LandingFooter />
    </div>
  )
}
