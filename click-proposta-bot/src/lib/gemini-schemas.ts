import { type Schema, Type } from '@google/genai'

export interface ExtractedItem {
  title: string
  amount: number
  price?: number | null
}

// Resposta completa do Gemini com Chain-of-Thought
export interface GeminiExtractionResponse {
  _raciocinio: string
  items: ExtractedItem[]
}

// Schema do objeto raiz que o Gemini deve retornar
export const budgetExtractionSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    _raciocinio: {
      type: Type.STRING,
      description:
        'Camada de processamento lógico (Chain-of-Thought). Narrar analiticamente: identificação e descarte de gírias, cálculo matemático das quantidades e deliberação conservadora sobre preços ANTES de preencher os items.',
    },
    items: {
      type: Type.ARRAY,
      description: 'Lista de itens de orçamento extraídos da mensagem bruta.',
      items: {
        type: Type.OBJECT,
        properties: {
          title: {
            type: Type.STRING,
            description:
              'Nome do produto ou serviço em Title Case com erros ortográficos corrigidos. Ex: "Pneu Aro 15", "Óleo Para Motor".',
          },
          amount: {
            type: Type.NUMBER,
            description:
              'Quantidade absoluta inteira. "um par" = 2, "meia dúzia" = 6, "duas dúzias" = 24. Singular sem quantidade explícita = 1.',
          },
          price: {
            type: Type.NUMBER,
            description:
              'Preço unitário SOMENTE se declarado de forma explícita e inegável pelo usuário. Gírias monetárias ("conto", "pila", "reais") são convertidas para valor numérico. SE NÃO HOUVER PREÇO EXPLÍCITO, retornar null obrigatoriamente.',
            nullable: true,
          },
        },
        required: ['title', 'amount'],
      },
    },
  },
  required: ['_raciocinio', 'items'],
}

// Mantemos o alias para compatibilidade com código existente
export const budgetItemSchema = budgetExtractionSchema

export function buildExtractionPrompt(
  text: string,
  budgetType: 'product' | 'civil'
): string {
  const typeLabel =
    budgetType === 'product'
      ? 'Orçamento de Produtos'
      : 'Orçamento de Serviço Civil'

  return `Você é o processador cognitivo e o motor de extração estruturada de entidades primário do sistema corporativo "Click Proposta".
Sua interface de atuação é exclusivamente backend, e sua diretriz operacional singular é atuar como o aparato de inteligência analítica que processa solicitações de usuários finais provenientes de mensagens textuais no WhatsApp.

O usuário final enviará mensagens em linguagem natural bruta, listando um ou múltiplos itens para compor um(a) ${typeLabel}. Devido à natureza inerente da mensageria via internet (o ecossistema WhatsApp no Brasil), a entrada de texto será tipicamente saturada de interferências comunicativas: gírias ("blz", "fds", "truta", "zap"), abreviações, interjeições informais, total desrespeito a regras de pontuação e erros ortográficos severos. A sua incumbência é agir como um filtro de estado, ignorar sumariamente o ruído linguístico e social, realizar a normalização sintática profunda e extrair EXATAMENTE as entidades de negócio solicitadas.

REGRAS DE EXTRAÇÃO:

1. Higienização e Padronização de Títulos (title): Isole e extraia estritamente os nomes dos produtos ou serviços desejados. Exclua qualquer comentário acessório, saudação ou tentativa de diálogo. Corrija imediatamente falhas de grafia. O campo extraído deve OBRIGATORIAMENTE obedecer ao formato "Title Case".

2. Avaliação e Transformação Matemática de Quantidades (amount): Mapeie termos coloquiais ou de grupo para algarismos absolutos inteiros. Singular ou sem métrica = 1. "um par" = 2. "dois pares" = 4. "meia dúzia" = 6. "duas dúzias" = 24.

3. Isolamento de Entidades Múltiplas: Escaneie exaustivamente a solicitação para delimitar itens heterogêneos mencionados em cascata. Cada tipo distinto de item = novo objeto independente no array items.

4. Alocação Restritiva e Explícita de Preços Unitários (price): SOMENTE popular este campo se o usuário declarar de forma totalmente explícita o valor financeiro por unidade. Interprete gírias monetárias ("conto", "pila", "reais"). É TERMINANTEMENTE PROIBIDO inferir, adivinhar ou estimar o preço. Se não constar do texto, retornar null.

5. Chain-of-Thought obrigatória: Preencha PRIMEIRO o campo _raciocinio narrando analiticamente: identificação e descarte das gírias, equacionamento das quantidades, deliberação sobre preços. DEPOIS preencha o array items.

MENSAGEM DO USUÁRIO:
"""
${text}
"""`
}
