import { GoogleGenAI } from '@google/genai'
import { env } from '../../env'
import {
  budgetExtractionSchema,
  buildExtractionPrompt,
  type ExtractedItem,
  type GeminiExtractionResponse,
} from '../../lib/gemini-schemas'
import type { AiProvider } from './ai-provider'

export const gemini = new GoogleGenAI({
  apiKey: env.GEMINI_API_KEY,
})

export class GeminiAiProvider implements AiProvider {
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
          temperature: 0,
        },
      })

      const jsonText = response.text

      if (!jsonText) {
        return []
      }

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
          temperature: 0,
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
