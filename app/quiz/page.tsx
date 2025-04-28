"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'

const quizzes = [
  {
    id: 1,
    title: 'Vocabulaire de base',
    description: 'Testez votre connaissance du vocabulaire français',
    questions: [
      {
        id: 1,
        question: 'Comment dit-on "hello" en français ?',
        options: ['Bonjour', 'Au revoir', 'Merci', 'S\'il vous plaît'],
        correctAnswer: 'Bonjour'
      },
      {
        id: 2,
        question: 'Quel est le contraire de "grand" ?',
        options: ['Petit', 'Beau', 'Vieux', 'Jeune'],
        correctAnswer: 'Petit'
      }
    ]
  },
  {
    id: 2,
    title: 'Grammaire',
    description: 'Évaluez votre maîtrise de la grammaire française',
    questions: [
      {
        id: 1,
        question: 'Quelle est la bonne conjugaison de "manger" à la première personne du singulier ?',
        options: ['Je mange', 'Je manges', 'Je mangent', 'Je mangé'],
        correctAnswer: 'Je mange'
      },
      {
        id: 2,
        question: 'Quel article utilise-t-on devant "école" ?',
        options: ['Le', 'La', 'Les', 'L\''],
        correctAnswer: 'L\''
      }
    ]
  }
]

export default function QuizPage() {
  const [selectedQuiz, setSelectedQuiz] = useState<number | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string>('')
  const [score, setScore] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const { user } = useAuth()

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Quiz</h1>
        <p>Veuillez vous connecter pour accéder aux quiz.</p>
      </div>
    )
  }

  const handleAnswer = () => {
    const quiz = quizzes.find(q => q.id === selectedQuiz)
    if (!quiz) return

    if (selectedAnswer === quiz.questions[currentQuestion].correctAnswer) {
      setScore(score + 1)
    }

    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer('')
    } else {
      setShowResults(true)
    }
  }

  const resetQuiz = () => {
    setSelectedQuiz(null)
    setCurrentQuestion(0)
    setSelectedAnswer('')
    setScore(0)
    setShowResults(false)
  }

  if (selectedQuiz === null) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">Quiz</h1>
        <div className="grid gap-6 md:grid-cols-2">
          {quizzes.map((quiz) => (
            <Card key={quiz.id} className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{quiz.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{quiz.description}</p>
                <Button onClick={() => setSelectedQuiz(quiz.id)}>
                  Commencer le quiz
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const quiz = quizzes.find(q => q.id === selectedQuiz)
  if (!quiz) return null

  if (showResults) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Résultats</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg mb-4">
              Votre score : {score} sur {quiz.questions.length}
            </p>
            <Button onClick={resetQuiz}>
              Retour aux quiz
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="outline"
        className="mb-6"
        onClick={resetQuiz}
      >
        Retour aux quiz
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>
            Question {currentQuestion + 1} sur {quiz.questions.length}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg mb-6">{quiz.questions[currentQuestion].question}</p>
          
          <RadioGroup
            value={selectedAnswer}
            onValueChange={setSelectedAnswer}
            className="space-y-4"
          >
            {quiz.questions[currentQuestion].options.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={option} />
                <Label htmlFor={option}>{option}</Label>
              </div>
            ))}
          </RadioGroup>

          <Button
            className="mt-6"
            onClick={handleAnswer}
            disabled={!selectedAnswer}
          >
            {currentQuestion < quiz.questions.length - 1 ? 'Question suivante' : 'Terminer'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
} 