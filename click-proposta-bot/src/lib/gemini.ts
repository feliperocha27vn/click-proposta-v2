import { GoogleGenAI } from '@google/genai'
import { env } from '../env'
import {
  budgetExtractionSchema,
  buildExtractionPrompt,
  type ExtractedItem,
  type GeminiExtractionResponse,
} from './gemini-schemas'

export const gemini = new GoogleGenAI({
  apiKey: env.GEMINI_API_KEY,
})

export class GeminiService {
  /**
   * Extrai de forma inteligente os itens de um orçamento usando o Gemini.
   * Utiliza Chain-of-Thought via campo _raciocinio para maior precisão.
   */
  async extractBudgetItems(
    text: string,
    budgetType: 'product' | 'civil'
  ): Promise<ExtractedItem[]> {
    const prompt = buildExtractionPrompt(text, budgetType)

    try {
      const response = await gemini.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: budgetExtractionSchema,
          // Temperatura 0: sem criatividade, extração determinística
          temperature: 0,
        },
      })

      const jsonText = response.text

      if (!jsonText) {
        return []
      }

      // O retorno agora é { _raciocinio, items } — extraímos apenas os items
      const parsed = JSON.parse(jsonText) as GeminiExtractionResponse

      console.log(
        `[Gemini] Raciocínio: ${parsed._raciocinio?.substring(0, 120)}...`
      )
      console.log(
        `[Gemini] Extração Sucedida: ${parsed.items.length} itens encontrados em "${text.substring(0, 60)}"`
      )

      return parsed.items ?? []
    } catch (error) {
      console.error('[Gemini] Erro crítico ao extrair itens:', error)
      return []
    }
  }
  /**
   * Transcreve um áudio em base64 recebido pelo WhatsApp.
   */
  async transcribeAudio(
    base64Audio: string,
    mimeType: string
  ): Promise<string> {
    try {
      const response = await gemini.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: 'Transcreva este áudio exatamente como foi falado. Não adicione explicações, comentários ou formatações extras. Apenas o texto transcrito.',
              },
              {
                inlineData: {
                  data: base64Audio,
                  mimeType: mimeType,
                },
              },
            ],
          },
        ],
        config: {
          temperature: 0, // Transcrição determinística
        },
      })

      const transcribedText = response.text || ''

      console.log(
        `[Gemini] Áudio transcrito com sucesso: "${transcribedText.substring(0, 60)}..."`
      )

      return transcribedText
    } catch (error) {
      console.error('[Gemini] Erro crítico ao transcrever áudio:', error)
      return ''
    }
  }
}
