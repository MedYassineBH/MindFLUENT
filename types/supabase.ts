export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      decks: {
        Row: {
          id: string
          created_at: string
          title: string
          description: string
          progress: number
          cards: Card[]
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          description: string
          progress?: number
          cards?: Card[]
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          description?: string
          progress?: number
          cards?: Card[]
          user_id?: string
        }
      }
      profiles: {
        Row: {
          id: string
          created_at: string
          username: string | null
          bio: string | null
          avatar_url: string | null
          language_level: string | null
          daily_goal: number | null
          preferred_language: string | null
          preferred_theme: string | null
          notifications_enabled: boolean | null
        }
        Insert: {
          id: string
          created_at?: string
          username?: string | null
          bio?: string | null
          avatar_url?: string | null
          language_level?: string | null
          daily_goal?: number | null
          preferred_language?: string | null
          preferred_theme?: string | null
          notifications_enabled?: boolean | null
        }
        Update: {
          id?: string
          created_at?: string
          username?: string | null
          bio?: string | null
          avatar_url?: string | null
          language_level?: string | null
          daily_goal?: number | null
          preferred_language?: string | null
          preferred_theme?: string | null
          notifications_enabled?: boolean | null
        }
      }
      messages: {
        Row: {
          id: string
          created_at: string
          content: string
          role: string
          user_id: string
          conversation_id: string
          language: string
          is_edited: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          content: string
          role: string
          user_id: string
          conversation_id: string
          language: string
          is_edited?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          content?: string
          role?: string
          user_id?: string
          conversation_id?: string
          language?: string
          is_edited?: boolean
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

interface Card {
  id: string
  front: string
  back: string
  confidence: number
} 