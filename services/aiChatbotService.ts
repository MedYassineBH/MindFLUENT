import OpenAI from 'openai'
import { supabase } from '../lib/supabaseClient'
import { Language } from '../types/database.types'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

const languageNames: Record<Language, string> = {
  en: 'English',
  fr: 'French',
  ar: 'Arabic',
  de: 'German',
  es: 'Spanish',
  it: 'Italian',
  pt: 'Portuguese',
  ru: 'Russian',
  zh: 'Chinese',
  ja: 'Japanese',
  ko: 'Korean'
}

export const aiChatbotService = {
  async getGrammarCorrection(text: string, language: Language): Promise<{ correctedText: string; explanation: string }> {
    try {
      const response = await openai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: `You are a helpful language tutor specializing in ${languageNames[language]}. Your task is to correct grammar mistakes and provide clear explanations.`
          },
          {
            role: 'user',
            content: `Please correct this ${languageNames[language]} text and explain the corrections: "${text}"`
          }
        ],
        model: 'gpt-4'
      })

      const content = response.choices[0]?.message?.content
      if (!content) {
        throw new Error('No response received from AI')
      }

      // Parse the AI response to separate correction and explanation
      const [correctedText, explanation] = content.split('\n\nExplanation:').map((str: string) => str.trim())

      return {
        correctedText: correctedText.replace(/^Correction: /, ''),
        explanation
      }
    } catch (error) {
      console.error('Error in getGrammarCorrection:', error)
      throw new Error('Failed to get grammar correction')
    }
  },

  async getChatResponse(userId: string, message: string, language: Language, interfaceLanguage: Language): Promise<string> {
    try {
      // Get chat history
      const { data: chatHistory } = await supabase
        .from('chat_messages')
        .select('role, content')
        .eq('user_id', userId)
        .order('created_at', { ascending: true })
        .limit(10)

      const response = await openai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: `You are a helpful language tutor specializing in ${languageNames[language]}. Provide responses in ${languageNames[language]} and explanations in ${languageNames[interfaceLanguage]}.`
          },
          ...(chatHistory || []).map(msg => ({
            role: msg.role as 'user' | 'assistant',
            content: msg.content
          })),
          {
            role: 'user',
            content: message
          }
        ],
        model: 'gpt-4'
      })

      const content = response.choices[0]?.message?.content
      if (!content) {
        throw new Error('No response received from AI')
      }

      // Save the conversation
      await supabase.from('chat_messages').insert([
        {
          user_id: userId,
          role: 'user',
          content: message,
          language
        },
        {
          user_id: userId,
          role: 'assistant',
          content,
          language
        }
      ])

      return content
    } catch (error) {
      console.error('Error in getChatResponse:', error)
      throw new Error('Failed to get chat response')
    }
  },

  async getChatHistory(userId: string): Promise<Array<{ role: 'user' | 'assistant'; content: string }>> {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('role, content')
        .eq('user_id', userId)
        .order('created_at', { ascending: true })

      if (error) throw error

      return data || []
    } catch (error) {
      console.error('Error in getChatHistory:', error)
      throw new Error('Failed to get chat history')
    }
  },

  async clearChatHistory(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('chat_messages')
        .delete()
        .eq('user_id', userId)

      if (error) throw error
    } catch (error) {
      console.error('Error in clearChatHistory:', error)
      throw new Error('Failed to clear chat history')
    }
  }
} 