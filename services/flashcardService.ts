import { supabase } from '../lib/supabaseClient'
import { Database } from '../types/database.types'

type Flashcard = Database['public']['Tables']['flashcards']['Row']

export const flashcardService = {
  async createFlashcard(
    userId: string,
    term: string,
    translation: string,
    imageUrl?: string,
    audioUrl?: string
  ): Promise<Flashcard> {
    const { data, error } = await supabase
      .from('flashcards')
      .insert({
        user_id: userId,
        term,
        translation,
        image_url: imageUrl,
        audio_url: audioUrl
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getUserFlashcards(userId: string): Promise<Flashcard[]> {
    const { data, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('user_id', userId)

    if (error) throw error
    return data
  },

  async updateFlashcard(
    id: string,
    updates: Partial<Omit<Flashcard, 'id' | 'user_id'>>
  ): Promise<Flashcard> {
    const { data, error } = await supabase
      .from('flashcards')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async deleteFlashcard(id: string): Promise<void> {
    const { error } = await supabase
      .from('flashcards')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
} 