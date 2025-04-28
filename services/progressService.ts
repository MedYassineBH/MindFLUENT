import { supabase } from '../lib/supabaseClient'
import { Database } from '../types/database.types'

type Activity = Database['public']['Tables']['activities']['Row']
type Achievement = Database['public']['Tables']['achievements']['Row']

export const progressService = {
  // Activity-related functions
  async createActivity(userId: string, activityType: string, score: number): Promise<Activity> {
    const { data, error } = await supabase
      .from('activities')
      .insert({
        user_id: userId,
        activity_type: activityType,
        score: score,
        completed_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getUserActivities(userId: string): Promise<Activity[]> {
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false })

    if (error) throw error
    return data
  },

  // Achievement-related functions
  async createAchievement(
    userId: string,
    name: string,
    description: string,
    target: number
  ): Promise<Achievement> {
    const { data, error } = await supabase
      .from('achievements')
      .insert({
        user_id: userId,
        name,
        description,
        target,
        progress: 0,
        is_completed: false
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getUserAchievements(userId: string): Promise<Achievement[]> {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  async updateAchievementProgress(
    achievementId: string,
    progress: number
  ): Promise<Achievement> {
    const { data: achievement, error: fetchError } = await supabase
      .from('achievements')
      .select('*')
      .eq('id', achievementId)
      .single()

    if (fetchError) throw fetchError

    const newProgress = Math.min(progress, achievement.target)
    const isCompleted = newProgress >= achievement.target

    const { data, error } = await supabase
      .from('achievements')
      .update({
        progress: newProgress,
        is_completed: isCompleted,
        updated_at: new Date().toISOString()
      })
      .eq('id', achievementId)
      .select()
      .single()

    if (error) throw error
    return data
  }
} 