import { supabase } from '../lib/supabaseClient'
import { Database, Language, Theme, UserPreferences } from '../types/database.types'

const defaultPreferences: UserPreferences = {
  interfaceLanguage: 'en',
  learningLanguages: ['fr'],
  theme: 'system',
  notifications: true
}

export const preferencesService = {
  async getUserPreferences(userId: string): Promise<UserPreferences> {
    const { data, error } = await supabase
      .from('users')
      .select('preferences')
      .eq('id', userId)
      .single()

    if (error) throw error
    return data?.preferences || defaultPreferences
  },

  async updateUserPreferences(
    userId: string,
    preferences: Partial<UserPreferences>
  ): Promise<UserPreferences> {
    const currentPreferences = await this.getUserPreferences(userId)
    const updatedPreferences = { ...currentPreferences, ...preferences }

    const { data, error } = await supabase
      .from('users')
      .update({ preferences: updatedPreferences })
      .eq('id', userId)
      .select('preferences')
      .single()

    if (error) throw error
    return data.preferences
  },

  async setInterfaceLanguage(userId: string, language: Language): Promise<void> {
    await this.updateUserPreferences(userId, { interfaceLanguage: language })
  },

  async addLearningLanguage(userId: string, language: Language): Promise<void> {
    const preferences = await this.getUserPreferences(userId)
    if (!preferences.learningLanguages.includes(language)) {
      await this.updateUserPreferences(userId, {
        learningLanguages: [...preferences.learningLanguages, language]
      })
    }
  },

  async removeLearningLanguage(userId: string, language: Language): Promise<void> {
    const preferences = await this.getUserPreferences(userId)
    await this.updateUserPreferences(userId, {
      learningLanguages: preferences.learningLanguages.filter(lang => lang !== language)
    })
  },

  async setTheme(userId: string, theme: Theme): Promise<void> {
    await this.updateUserPreferences(userId, { theme })
  },

  async setNotifications(userId: string, enabled: boolean): Promise<void> {
    await this.updateUserPreferences(userId, { notifications: enabled })
  }
} 