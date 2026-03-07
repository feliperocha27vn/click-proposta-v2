import type { ExtractedItem } from '../../lib/gemini-schemas'

export interface AiProvider {
  extractBudgetItems(
    text: string,
    budgetType: 'product' | 'civil'
  ): Promise<ExtractedItem[]>
  extractTotalValue(text: string): Promise<number | null>
  transcribeAudio(base64Audio: string, mimeType: string): Promise<string>
}
