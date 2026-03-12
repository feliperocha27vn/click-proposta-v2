import { createFileRoute } from '@tanstack/react-router'
import { LandingFooter } from './-components/landing-footer'

export const Route = createFileRoute('/privacy-policy')({
  component: PrivacyPolicy,
})

function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col selection:bg-blue-200">
      {/* Header Area */}
      <div className="bg-zinc-900 py-24 px-6 md:px-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        <div className="relative max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">Política de Privacidade</h1>
          <p className="text-zinc-400 text-lg">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
        </div>
      </div>

      {/* Content Area */}
      <main className="flex-1 max-w-4xl mx-auto px-6 py-16 w-full text-zinc-800">
        <div className="prose prose-zinc max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-blue-600 hover:prose-a:text-blue-500 prose-p:leading-relaxed prose-li:leading-relaxed">
          <p className="text-lg text-zinc-600 mb-8 font-medium">
            A Click Proposta está comprometida com a proteção dos seus dados pessoais e com a conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).
          </p>

          <h2 className="text-2xl mt-12 mb-6">1. Coleta e Uso de Dados</h2>
          <p>
            O Click Proposta é um SaaS (Software as a Service) projetado para freelancers e empresas criarem propostas e orçamentos profissionais. Para prestar nossos serviços, coletamos as seguintes categorias de dados:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-8">
            <li><strong>Dados de Cadastro:</strong> Nome, e-mail, telefone, CPF/CNPJ e endereço. Estes dados são necessários para a criação da sua conta e para fins de faturamento e emissão de notas fiscais.</li>
            <li><strong>Dados de Terceiros (Seus Clientes):</strong> Dados que você insere na plataforma para gerar as propostas, como nome, e-mail e telefone do seu cliente.</li>
          </ul>

          <h2 className="text-2xl mt-12 mb-6">2. Base Legal e Finalidade</h2>
          <p>
            O tratamento dos seus dados pessoais é realizado com base nas seguintes hipóteses legais previstas na LGPD:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-8">
            <li><strong>Execução de Contrato:</strong> Para a prestação do serviço contratado, criação das propostas, gestão da sua assinatura e suporte técnico.</li>
            <li><strong>Legítimo Interesse:</strong> Para melhorias contínuas na plataforma, segurança da informação e prevenção de fraudes.</li>
            <li><strong>Cumprimento de Obrigação Legal:</strong> Para a guarda de registros de acesso (Marco Civil da Internet) e emissão de documentos fiscais.</li>
          </ul>

          <h2 className="text-2xl mt-12 mb-6">3. Compartilhamento de Dados</h2>
          <p>
            Não vendemos seus dados. O compartilhamento ocorre de forma estritamente necessária com parceiros de infraestrutura, com contratos firmados que garantem a proteção dos seus dados:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-8">
            <li><strong>Supabase:</strong> Provedor de banco de dados e autenticação (Google Auth e Email/Senha).</li>
            <li><strong>Stripe:</strong> Processador de pagamentos responsável pela gestão segura de assinaturas e informações financeiras.</li>
            <li><strong>Google Gemini API:</strong> Provedor de Inteligência Artificial para processamento e geração de orçamentos estruturados.</li>
            <li><strong>Evolution API (WhatsApp):</strong> Provedor da integração para o envio e recebimento de mensagens através do nosso bot no WhatsApp.</li>
          </ul>

          <h2 className="text-2xl mt-12 mb-6">4. Sua Responsabilidade como Controlador</h2>
          <p className="mb-8">
            Ao utilizar o Click Proposta, você insere dados pessoais dos <strong>seus próprios clientes</strong> (terceiros) para gerar propostas. Nos termos da LGPD, você atua como o <strong>Controlador</strong> desses dados, enquanto a Click Proposta atua apenas como <strong>Operadora</strong>. É sua responsabilidade garantir que possui a base legal adequada (como consentimento ou execução de contrato) para coletar e inserir esses dados na plataforma.
          </p>

          <h2 className="text-2xl mt-12 mb-6">5. Seus Direitos (Titular dos Dados)</h2>
          <p>
            Conforme a LGPD, você possui os seguintes direitos em relação aos seus dados pessoais:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-8">
            <li><strong>Acesso e Confirmação:</strong> Saber se tratamos seus dados e solicitar uma cópia.</li>
            <li><strong>Correção:</strong> Solicitar a correção de dados incompletos, inexatos ou desatualizados diretamente no seu painel.</li>
            <li><strong>Exclusão:</strong> Solicitar a exclusão dos seus dados e encerramento da conta, ressalvadas as obrigações legais de guarda.</li>
            <li><strong>Anonimização ou Bloqueio:</strong> De dados desnecessários ou excessivos.</li>
          </ul>

          <p className="mt-12 text-zinc-500 italic">
            Para exercer seus direitos, entre em contato através do nosso suporte ou pelos canais oficiais de comunicação disponíveis na plataforma.
          </p>
        </div>
      </main>
      
      <LandingFooter />
    </div>
  )
}
