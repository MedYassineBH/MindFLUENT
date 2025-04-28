import { supabase } from '../lib/supabaseClient'
import { Database } from '../types/database.types'

type VoiceAttempt = Database['public']['Tables']['voice_recognition_attempts']['Row']

export const voiceService = {
  async evaluatePronunciation(
    userId: string,
    audioInput: string
  ): Promise<VoiceAttempt> {
    // Here you would typically:
    // 1. Upload the audio to storage
    // 2. Call a speech recognition API
    // 3. Compare with expected pronunciation
    // For now, we'll simulate the evaluation
    const evaluation = true // Replace with actual evaluation
    const feedback = "Good pronunciation!" // Replace with actual feedback

    const { data, error } = await supabase
      .from('voice_recognition_attempts')
      .insert({
        user_id: userId,
        audio_input: audioInput,
        evaluation,
        feedback
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getUserAttempts(userId: string): Promise<VoiceAttempt[]> {
    const { data, error } = await supabase
      .from('voice_recognition_attempts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  async getAttemptById(attemptId: string): Promise<VoiceAttempt> {
    const { data, error } = await supabase
      .from('voice_recognition_attempts')
      .select('*')
      .eq('id', attemptId)
      .single()

    if (error) throw error
    return data
  }
} 