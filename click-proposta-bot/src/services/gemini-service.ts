import { gemini } from '../lib/gemini'
import {
  budgetItemSchema,
  buildExtractionPrompt,
  type ExtractedItem,
} from './gemini-schemas'

export class GeminiService {
  /**
   * Extrai de forma inteligente os itens de um orçamento usando o Gemini 1.5 Flash.
   */
  async extractBudgetItems(
    text: string,
    budgetType: 'product' | 'civil'
  ): Promise<ExtractedItem[]> {
    // 1. Gera o prompt detalhado a partir do nosso arquivo de Schemas
    const prompt = buildExtractionPrompt(text, budgetType)

    try {
      // 2. Chama a inteligência artificial da Google (gemini-2.5-flash é super rápido para esse tipo de tarefa)
      const response = await gemini.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          // Aqui forçamos a IA a nos devolver EXATAMENTE um array JSON baseado no nosso Schema Rigoroso
          responseMimeType: 'application/json',
          responseSchema: budgetItemSchema,
          // Temperatura 0 forçamos o modelo a não "alucinar" ou ser criativo com as palavras/nomes se não as encontrar no texto principal
          temperature: 0,
        },
      })

      const jsonText = response.text

      if (!jsonText) {
        return []
      }

      // 3. O Gemini garante que o formato JSON retornado é convertível para a nossa interface ExtractedItem
      const items = JSON.parse(jsonText) as ExtractedItem[]

      console.log(
        `[Gemini] Extração Sucedida: Encontrados ${items.length} itens reais de '${text}'`
      )
      return items
    } catch (error) {
      console.error('[Gemini] Erro crítico ao extrair itens:', error)
      return []
    }
  }
}
