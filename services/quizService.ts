import { supabase } from '../lib/supabaseClient'
import { Database } from '../types/database.types'
import { Question } from '../types/database.types'

type Quiz = Database['public']['Tables']['quizzes']['Row']
type QuizQuestion = Database['public']['Tables']['questions']['Row']

export const quizService = {
  async createQuiz(userId: string, questions: Omit<Question, 'id' | 'quiz_id'>[]): Promise<Quiz> {
    // First create the quiz
    const { data: quiz, error: quizError } = await supabase
      .from('quizzes')
      .insert({
        user_id: userId,
        questions: [],
        score: 0
      })
      .select()
      .single()

    if (quizError) throw quizError

    // Then create all questions
    const questionsWithQuizId = questions.map(question => ({
      ...question,
      quiz_id: quiz.id
    }))

    const { data: createdQuestions, error: questionsError } = await supabase
      .from('questions')
      .insert(questionsWithQuizId)
      .select()

    if (questionsError) throw questionsError

    // Update quiz with questions
    const { data: updatedQuiz, error: updateError } = await supabase
      .from('quizzes')
      .update({ questions: createdQuestions })
      .eq('id', quiz.id)
      .select()
      .single()

    if (updateError) throw updateError
    return updatedQuiz
  },

  async getUserQuizzes(userId: string): Promise<Quiz[]> {
    const { data, error } = await supabase
      .from('quizzes')
      .select('*, questions(*)')
      .eq('user_id', userId)

    if (error) throw error
    return data
  },

  async getQuizById(quizId: string): Promise<Quiz> {
    const { data, error } = await supabase
      .from('quizzes')
      .select('*, questions(*)')
      .eq('id', quizId)
      .single()

    if (error) throw error
    return data
  },

  async submitQuizAnswer(
    quizId: string,
    questionId: string,
    answer: string
  ): Promise<boolean> {
    const { data: question, error } = await supabase
      .from('questions')
      .select('correct_response')
      .eq('id', questionId)
      .eq('quiz_id', quizId)
      .single()

    if (error) throw error
    return question.correct_response === answer
  },

  async updateQuizScore(quizId: string, score: number): Promise<Quiz> {
    const { data, error } = await supabase
      .from('quizzes')
      .update({ score })
      .eq('id', quizId)
      .select()
      .single()

    if (error) throw error
    return data
  }
} 