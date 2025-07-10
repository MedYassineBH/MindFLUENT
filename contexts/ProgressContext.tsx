'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

interface Progress {
  grammar: {
    completedLessons: number
    totalLessons: number
    lastCompleted: string | null
  }
  pronunciation: {
    completedExercises: number
    totalExercises: number
    lastCompleted: string | null
  }
  flashcards: {
    masteredCards: number
    totalCards: number
    lastReviewed: string | null
  }
  quiz: {
    completedQuizzes: number
    totalQuizzes: number
    averageScore: number
    lastCompleted: string | null
  }
}

interface ProgressContextType {
  progress: Progress
  updateProgress: (section: keyof Progress, data: Partial<Progress[keyof Progress]>) => Promise<void>
  isLoading: boolean
}

const defaultProgress: Progress = {
  grammar: {
    completedLessons: 0,
    totalLessons: 20,
    lastCompleted: null,
  },
  pronunciation: {
    completedExercises: 0,
    totalExercises: 15,
    lastCompleted: null,
  },
  flashcards: {
    masteredCards: 0,
    totalCards: 100,
    lastReviewed: null,
  },
  quiz: {
    completedQuizzes: 0,
    totalQuizzes: 10,
    averageScore: 0,
    lastCompleted: null,
  },
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const ProgressContext = createContext<ProgressContextType | undefined>(undefined)

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<Progress>(defaultProgress)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchProgress()
  }, [])

  const fetchProgress = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error) throw error

      if (data) {
        setProgress(data.progress)
      }
    } catch (error) {
      console.error('Error fetching progress:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateProgress = async (
    section: keyof Progress,
    data: Partial<Progress[keyof Progress]>
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const newProgress = {
        ...progress,
        [section]: {
          ...progress[section],
          ...data,
        },
      }

      const { error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          progress: newProgress,
          updated_at: new Date().toISOString(),
        })

      if (error) throw error

      setProgress(newProgress)
    } catch (error) {
      console.error('Error updating progress:', error)
    }
  }

  return (
    <ProgressContext.Provider value={{ progress, updateProgress, isLoading }}>
      {children}
    </ProgressContext.Provider>
  )
}

export function useProgress() {
  const context = useContext(ProgressContext)
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider')
  }
  return context
} 