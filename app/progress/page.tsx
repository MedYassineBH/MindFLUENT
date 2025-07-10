"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useProgress } from '@/contexts/ProgressContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { Book, Mic, BookOpen, ClipboardCheck } from 'lucide-react'

export default function ProgressPage() {
  const { progress, isLoading } = useProgress()
  const { t } = useLanguage()

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Loading progress...</h1>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Your Progress</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Book className="w-5 h-5" />
            <CardTitle>Grammar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span>Completed Lessons</span>
                  <span>
                    {progress.grammar.completedLessons} / {progress.grammar.totalLessons}
                  </span>
                </div>
                <Progress
                  value={
                    (progress.grammar.completedLessons / progress.grammar.totalLessons) * 100
                  }
                />
              </div>
              {progress.grammar.lastCompleted && (
                <p className="text-sm text-muted-foreground">
                  Last completed: {new Date(progress.grammar.lastCompleted).toLocaleDateString()}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Mic className="w-5 h-5" />
            <CardTitle>Pronunciation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span>Completed Exercises</span>
                  <span>
                    {progress.pronunciation.completedExercises} /{' '}
                    {progress.pronunciation.totalExercises}
                  </span>
                </div>
                <Progress
                  value={
                    (progress.pronunciation.completedExercises /
                      progress.pronunciation.totalExercises) *
                    100
                  }
                />
              </div>
              {progress.pronunciation.lastCompleted && (
                <p className="text-sm text-muted-foreground">
                  Last completed: {new Date(progress.pronunciation.lastCompleted).toLocaleDateString()}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <BookOpen className="w-5 h-5" />
            <CardTitle>Flashcards</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span>Mastered Cards</span>
                  <span>
                    {progress.flashcards.masteredCards} / {progress.flashcards.totalCards}
                  </span>
                </div>
                <Progress
                  value={
                    (progress.flashcards.masteredCards / progress.flashcards.totalCards) * 100
                  }
                />
              </div>
              {progress.flashcards.lastReviewed && (
                <p className="text-sm text-muted-foreground">
                  Last reviewed: {new Date(progress.flashcards.lastReviewed).toLocaleDateString()}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <ClipboardCheck className="w-5 h-5" />
            <CardTitle>Quizzes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span>Completed Quizzes</span>
                  <span>
                    {progress.quiz.completedQuizzes} / {progress.quiz.totalQuizzes}
                  </span>
                </div>
                <Progress
                  value={
                    (progress.quiz.completedQuizzes / progress.quiz.totalQuizzes) * 100
                  }
                />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span>Average Score</span>
                  <span>{progress.quiz.averageScore}%</span>
                </div>
                <Progress value={progress.quiz.averageScore} />
              </div>
              {progress.quiz.lastCompleted && (
                <p className="text-sm text-muted-foreground">
                  Last completed: {new Date(progress.quiz.lastCompleted).toLocaleDateString()}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 