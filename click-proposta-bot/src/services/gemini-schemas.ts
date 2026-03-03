import { type Schema, Type } from '@google/genai'

export interface ExtractedItem {
  title: string
  amount: number
  price?: number | null
}

// Em vez de deixar no meio do serviço, separamos a estrutura (schema) que a IA precisa nos devolver
export const budgetItemSchema: Schema = {
  type: Type.ARRAY,
  description:
    'Lista de itens de orçamento detalhados extraídos da mensagem bruta.',
  items: {
    type: Type.OBJECT,
    properties: {
      title: {
        type: Type.STRING,
        description:
          'Nome claro e formatado do produto ou serviço (ex: "Porta de Madeira Reforçada", "Instalação de Pia"). Remova erros de digitação e deixe o texto profissional.',
      },
      amount: {
        type: Type.NUMBER,
        description:
          'Quantidade numérica solicitada. Se o usuário referenciar pares ou dúzias, calcule o valor total numérico. Se nenhuma quantidade for explícita, presuma 1.',
      },
      price: {
        type: Type.NUMBER,
        description:
          'Preço unitário numérico (ex: 150.50) se mencionado explicitamente pelo usuário na mensagem. Caso o valor mencionado seja total, tente descobrir o unitário dividindo pela quantidade, ou se não for possível ter certeza, deixe null. Não invente preços.',
        nullable: true,
      },
    },
    required: ['title', 'amount'],
  },
}

// Separamos também a lógica de gerar o texto que vai para a IA (o "Prompt")
// Dessa forma, se no futuro quisermos injetar mais regras (ex: proibir certos itens), mexemos só aqui.
export function buildExtractionPrompt(
  text: string,
  budgetType: 'product' | 'civil'
): string {
  const typeLabel =
    budgetType === 'product'
      ? 'Orçamento de Produtos'
      : 'Orçamento de Serviço Civil'

  return `
Você é um assistente especialista do sistema de orçamentos "Click Proposta". 
O seu papel é atuar como o cérebro por trás da extração inteligente de itens que chegam por WhatsApp.

**CONTEXTO:**
O usuário enviou uma mensagem em linguagem natural listando itens para um ${typeLabel}.
Sua tarefa é analisar essa mensagem, limpar sujeiras (ex: gírias, erros gramaticais nas descrições) e extrair EXATAMENTE o que a pessoa pediu.

**REGRAS CRÍTICAS DE EXTRAÇÃO:**
1. **Padronização:** Formate a primeira letra de cada palavra no campo \`title\` em maiúscula (Title Case). Corrija erros crassos de português no nome do produto.
2. **Quantidades Implícitas:** Se o usuário disser "quero um par de pneus", isso significa \`amount: 2\`. Se disser "duas dúzias de ovos", significa \`amount: 24\`.
3. **Múltiplos Itens:** Sempre procure identificar se há mais de um item distinto sendo pedido na mesma frase.
4. **Preços:** Só preencha o campo \`price\` se o usuário **explicitamente** indicar o valor que pagou ou deseja pagar por **cada unidade**. Não faça estimativas. Se não houver preço, retorne nulo.
5. **Apenas os Dados:** Restrinja sua resposta APENAS E ESTRITAMENTE ao JSON esperado.

**MENSAGEM DO USUÁRIO:**
"""
${text}
"""
  `.trim()
}
