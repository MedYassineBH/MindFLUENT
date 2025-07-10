"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useLanguage } from '@/contexts/LanguageContext'
import { useProgress } from '@/contexts/ProgressContext'
import { toast } from 'sonner'
import { Check, X, ArrowRight, ArrowLeft } from 'lucide-react'

interface Question {
  id: string
  type: 'multiple_choice' | 'true_false' | 'fill_blank' | 'matching'
  question: string
  options?: string[]
  correctAnswer: string | string[]
  explanation: string
  difficulty: 'easy' | 'medium' | 'hard'
}

const sampleQuestions: Question[] = [
  {
    id: '1',
    type: 'multiple_choice',
    question: 'Which of the following is a correct French sentence?',
    options: [
      'Je mange une pomme',
      'Je mange un pomme',
      'Je mange des pomme',
      'Je mange le pomme'
    ],
    correctAnswer: 'Je mange une pomme',
    explanation: 'The correct article for feminine singular nouns is "une"',
    difficulty: 'easy'
  },
  {
    id: '2',
    type: 'true_false',
    question: 'In French, adjectives always come after the noun',
    correctAnswer: 'false',
    explanation: 'Some adjectives come before the noun, like "beau", "bon", "grand"',
    difficulty: 'medium'
  },
  {
    id: '3',
    type: 'fill_blank',
    question: 'Complete the sentence: Je ___ (aller) à l\'école demain',
    correctAnswer: 'vais',
    explanation: 'The correct conjugation of "aller" in first person singular is "vais"',
    difficulty: 'hard'
  },
  {
    id: '4',
    type: 'matching',
    question: 'Match the French words with their English translations',
    options: ['Pomme', 'Livre', 'Fleur', 'Maison'],
    correctAnswer: ['Apple', 'Book', 'Flower', 'House'],
    explanation: 'Basic vocabulary matching exercise',
    difficulty: 'easy'
  }
]

export default function QuizPage() {
  const { t } = useLanguage()
  const { progress, updateProgress } = useProgress()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [showExplanation, setShowExplanation] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<string | string[] | null>(null)
  const [quizCompleted, setQuizCompleted] = useState(false)

  const currentQ = sampleQuestions[currentQuestion]

  const handleAnswer = (answer: string | string[]) => {
    setSelectedAnswer(answer)
    setShowExplanation(true)

    if (Array.isArray(currentQ.correctAnswer)) {
      if (Array.isArray(answer) && answer.every((ans, i) => ans === currentQ.correctAnswer[i])) {
        setScore(prev => prev + 1)
        toast.success('Correct!')
      } else {
        toast.error('Incorrect!')
      }
    } else {
      if (answer === currentQ.correctAnswer) {
        setScore(prev => prev + 1)
        toast.success('Correct!')
      } else {
        toast.error('Incorrect!')
      }
    }
  }

  const handleNext = () => {
    if (currentQuestion < sampleQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
      setShowExplanation(false)
      setSelectedAnswer(null)
    } else {
      setQuizCompleted(true)
      updateProgress('quiz', {
        completedQuizzes: progress.quiz.completedQuizzes + 1,
        averageScore: (progress.quiz.averageScore * progress.quiz.completedQuizzes + score) / (progress.quiz.completedQuizzes + 1),
        lastCompleted: new Date().toISOString()
      })
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
      setShowExplanation(false)
      setSelectedAnswer(null)
    }
  }

  const restartQuiz = () => {
    setCurrentQuestion(0)
    setScore(0)
    setShowExplanation(false)
    setSelectedAnswer(null)
    setQuizCompleted(false)
  }

  if (quizCompleted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Quiz Completed!</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold">
                Your Score: {score}/{sampleQuestions.length}
              </h2>
              <p className="text-muted-foreground">
                {score === sampleQuestions.length
                  ? 'Perfect! You got all questions right!'
                  : score >= sampleQuestions.length / 2
                  ? 'Good job! Keep practicing!'
                  : 'Keep practicing to improve your score!'}
              </p>
              <Button onClick={restartQuiz}>Try Again</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Progress
          value={(currentQuestion / sampleQuestions.length) * 100}
          className="mb-4"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Question {currentQuestion + 1} of {sampleQuestions.length}</span>
          <span>Score: {score}</span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{currentQ.question}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {currentQ.type === 'multiple_choice' && (
              <div className="space-y-2">
                {currentQ.options?.map((option, index) => (
                  <Button
                    key={index}
                    variant={selectedAnswer === option ? 'default' : 'outline'}
                    className="w-full justify-start"
                    onClick={() => !showExplanation && handleAnswer(option)}
                    disabled={showExplanation}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            )}

            {currentQ.type === 'true_false' && (
              <div className="flex gap-4">
                <Button
                  variant={selectedAnswer === 'true' ? 'default' : 'outline'}
                  className="flex-1"
                  onClick={() => !showExplanation && handleAnswer('true')}
                  disabled={showExplanation}
                >
                  True
                </Button>
                <Button
                  variant={selectedAnswer === 'false' ? 'default' : 'outline'}
                  className="flex-1"
                  onClick={() => !showExplanation && handleAnswer('false')}
                  disabled={showExplanation}
                >
                  False
                </Button>
              </div>
            )}

            {currentQ.type === 'fill_blank' && (
              <div className="space-y-2">
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  placeholder="Type your answer here"
                  value={selectedAnswer || ''}
                  onChange={(e) => !showExplanation && setSelectedAnswer(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !showExplanation) {
                      handleAnswer(selectedAnswer || '')
                    }
                  }}
                  disabled={showExplanation}
                />
                <Button
                  onClick={() => !showExplanation && handleAnswer(selectedAnswer || '')}
                  disabled={showExplanation || !selectedAnswer}
                >
                  Submit
                </Button>
              </div>
            )}

            {currentQ.type === 'matching' && (
              <div className="grid grid-cols-2 gap-4">
                {currentQ.options?.map((option, index) => (
                  <div key={index} className="space-y-2">
                    <p className="font-medium">{option}</p>
                    <input
                      type="text"
                      className="w-full p-2 border rounded"
                      placeholder="Match with English"
                      value={(selectedAnswer as string[])?.[index] || ''}
                      onChange={(e) => {
                        const newAnswers = [...((selectedAnswer as string[]) || [])]
                        newAnswers[index] = e.target.value
                        setSelectedAnswer(newAnswers)
                      }}
                      disabled={showExplanation}
                    />
                  </div>
                ))}
                <Button
                  onClick={() => !showExplanation && handleAnswer(selectedAnswer as string[])}
                  disabled={showExplanation || !selectedAnswer}
                  className="col-span-2"
                >
                  Submit
                </Button>
              </div>
            )}

            {showExplanation && (
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <p className="font-medium">Explanation:</p>
                <p>{currentQ.explanation}</p>
              </div>
            )}

            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              <Button onClick={handleNext}>
                {currentQuestion === sampleQuestions.length - 1 ? 'Finish' : 'Next'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 