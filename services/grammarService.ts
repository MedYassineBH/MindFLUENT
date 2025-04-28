import { supabase } from '../lib/supabaseClient'
import { Database, Language } from '../types/database.types'
import { aiChatbotService } from './aiChatbotService'

type Correction = Database['public']['Tables']['corrections']['Row']

export const grammarService = {
  async correctGrammar(
    userId: string,
    originalText: string,
    language: Language,
    interfaceLanguage: Language
  ): Promise<Correction> {
    // Get AI-powered correction and explanation
    const aiResponse = await aiChatbotService.getGrammarCorrection(originalText, language)

    // Store the correction
    const { data, error } = await supabase
      .from('corrections')
      .insert({
        user_id: userId,
        original_text: originalText,
        corrected_text: aiResponse.correctedText,
        explanation: aiResponse.explanation,
        language
      })
      .select()
      .single()

    if (error) throw error

    // Create a notification for the user about the correction
    await supabase.from('notifications').insert({
      user_id: userId,
      content: `New grammar correction available for your ${language} text.`,
      date: new Date().toISOString(),
      read: false,
      language
    })

    return data
  },

  async getUserCorrections(userId: string, language?: Language): Promise<Correction[]> {
    let query = supabase
      .from('corrections')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (language) {
      query = query.eq('language', language)
    }

    const { data, error } = await query
    if (error) throw error
    return data
  },

  async getCorrection(correctionId: string): Promise<Correction> {
    const { data, error } = await supabase
      .from('corrections')
      .select('*')
      .eq('id', correctionId)
      .single()

    if (error) throw error
    return data
  },

  async getChatbotHelp(
    userId: string,
    message: string,
    language: Language,
    interfaceLanguage: Language
  ) {
    return aiChatbotService.getChatResponse(userId, message, language, interfaceLanguage)
  },

  async getChatHistory(userId: string) {
    return aiChatbotService.getChatHistory(userId)
  },

  async clearChatHistory(userId: string) {
    return aiChatbotService.clearChatHistory(userId)
  }
} 