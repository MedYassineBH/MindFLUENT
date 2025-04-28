export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Language = 'en' | 'fr' | 'ar' | 'de' | 'es' | 'it' | 'pt' | 'ru' | 'zh' | 'ja' | 'ko'

export type Theme = 'light' | 'dark' | 'system'

export interface UserPreferences {
  interfaceLanguage: Language
  learningLanguages: Language[]
  theme: Theme
  notifications: boolean
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          name: string | null
          level: string
          total_points: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          name?: string | null
          level?: string
          total_points?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          name?: string | null
          level?: string
          total_points?: number
          created_at?: string
          updated_at?: string
        }
      }
      activities: {
        Row: {
          id: string
          user_id: string
          type: 'flashcard' | 'quiz' | 'pronunciation' | 'grammar'
          score: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'flashcard' | 'quiz' | 'pronunciation' | 'grammar'
          score: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'flashcard' | 'quiz' | 'pronunciation' | 'grammar'
          score?: number
          created_at?: string
        }
      }
      achievements: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          target: number
          progress: number
          completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          target: number
          progress?: number
          completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          target?: number
          progress?: number
          completed?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      chat_messages: {
        Row: {
          id: string
          user_id: string
          role: 'user' | 'assistant'
          content: string
          language: Language
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          role: 'user' | 'assistant'
          content: string
          language: Language
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          role?: 'user' | 'assistant'
          content?: string
          language?: Language
          created_at?: string
        }
      }
      language_content: {
        Row: {
          id: string
          language: Language
          content_type: 'flashcard' | 'quiz' | 'grammar' | 'pronunciation'
          title: string
          description: string
          difficulty: 'beginner' | 'intermediate' | 'advanced'
          content: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          language: Language
          content_type: 'flashcard' | 'quiz' | 'grammar' | 'pronunciation'
          title: string
          description: string
          difficulty: 'beginner' | 'intermediate' | 'advanced'
          content: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          language?: Language
          content_type?: 'flashcard' | 'quiz' | 'grammar' | 'pronunciation'
          title?: string
          description?: string
          difficulty?: 'beginner' | 'intermediate' | 'advanced'
          content?: Json
          created_at?: string
          updated_at?: string
        }
      }
      flashcards: {
        Row: {
          id: string
          user_id: string
          language: Language
          term: string
          translation: string
          image_url?: string
          audio_url?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          language: Language
          term: string
          translation: string
          image_url?: string
          audio_url?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          language?: Language
          term?: string
          translation?: string
          image_url?: string
          audio_url?: string
          created_at?: string
          updated_at?: string
        }
      }
      quizzes: {
        Row: {
          id: string
          user_id: string
          language: Language
          title: string
          description: string
          questions: Question[]
          score: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          language: Language
          title: string
          description: string
          questions: Question[]
          score: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          language?: Language
          title?: string
          description?: string
          questions?: Question[]
          score?: number
          created_at?: string
          updated_at?: string
        }
      }
      questions: {
        Row: {
          id: string
          quiz_id: string
          title: string
          responses: string[]
          correct_response: string
          explanation: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          quiz_id: string
          title: string
          responses: string[]
          correct_response: string
          explanation: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          quiz_id?: string
          title?: string
          responses?: string[]
          correct_response?: string
          explanation?: string
          created_at?: string
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          content: string
          language: Language
          date: string
          read: boolean
        }
        Insert: {
          id?: string
          user_id: string
          content: string
          language: Language
          date?: string
          read?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          content?: string
          language?: Language
          date?: string
          read?: boolean
        }
      }
      corrections: {
        Row: {
          id: string
          user_id: string
          language: Language
          original_text: string
          corrected_text: string
          explanation: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          language: Language
          original_text: string
          corrected_text: string
          explanation: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          language?: Language
          original_text?: string
          corrected_text?: string
          explanation?: string
          created_at?: string
          updated_at?: string
        }
      }
      voice_recognition_attempts: {
        Row: {
          id: string
          user_id: string
          language: Language
          audio_input: string
          evaluation: boolean
          feedback: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          language: Language
          audio_input: string
          evaluation: boolean
          feedback: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          language?: Language
          audio_input?: string
          evaluation?: boolean
          feedback?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export interface Question {
  id: string
  title: string
  responses: string[]
  correct_response: string
  explanation: string
} 